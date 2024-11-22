import 'dotenv/config'
import express from 'express';
import vectorStore from './vector-store.js';
import fs from 'fs/promises';
import llm from './model.js';
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { contextualizeQSystemPrompt, systemPrompt } from './prompt.js';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { addChat, getLast10Chats, getChatHistory } from './chat-history.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/training', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf8');
        const loader = new JSONLoader(
            new Blob([JSON.stringify(data)], { type: 'application/json' })
        )

        const docs = await loader.load()
        console.log(docs);


        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })

        const splits = await textSplitter.splitDocuments(docs)

        await vectorStore.addDocuments(splits)
        res.status(200).send('Training completed');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during training');
    }
});

app.post('/chat', async (req, res) => {
    const { question } = req.body; // Lấy câu hỏi từ dữ liệu gửi lên trong body của request
    const parser = new HttpResponseOutputParser(); // Tạo một parser để xử lý kết quả đầu ra từ AI
    const retriever = vectorStore.asRetriever(); // Biến vectorStore thành một retriever để truy xuất dữ liệu
    const histories = await getLast10Chats(); // Lấy 10 đoạn hội thoại gần nhất từ lịch sử
    await addChat('HUMAN', question); // Thêm câu hỏi của người dùng vào lịch sử với vai trò là "HUMAN"

    const chatHistory = histories.map((history) => { // Chuyển đổi lịch sử thành định dạng mà AI có thể hiểu
        if (history.role === 'AI') {
            return new AIMessage(history.content);
        }
        return new HumanMessage(history.content);
    });

    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([ // Tạo prompt để cung cấp ngữ cảnh cho câu hỏi
        ['system', contextualizeQSystemPrompt],
        new MessagesPlaceholder('chat_history'),
        ['ai', '{input}']
    ]);

    const historyAwareRetriever = await createHistoryAwareRetriever({ // Tạo retriever thông minh với ngữ cảnh
        llm,
        retriever,
        rephrasePrompt: contextualizeQPrompt
    });

    const qaPrompt = ChatPromptTemplate.fromMessages([ // Tạo prompt để AI trả lời câu hỏi
        ['system', systemPrompt],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}']
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({ // Tạo chain để AI xử lý câu hỏi
        llm,
        prompt: qaPrompt,
        outputParser: parser
    });

    const ragChain = await createRetrievalChain({ // Kết hợp truy xuất dữ liệu với xử lý câu hỏi
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnswerChain
    });

    res.setHeader('Content-Type', 'application/octet-stream'); // Thiết lập header để gửi dữ liệu từng phần
    res.setHeader('Transfer-Encoding', 'chunked'); // Sử dụng Transfer-Encoding kiểu 'chunked'

    const decoder = new TextDecoder('utf-8'); // Tạo decoder để chuyển đổi dữ liệu thành chuỗi
    let aiAnswer = ''; // Biến lưu câu trả lời từ AI

    try {
        for await (const chunk of await ragChain.stream({ // Lấy từng đoạn dữ liệu trả về từ AI
            input: question,
            chat_history: chatHistory
        })) {
            if (res.writableEnded) {
                break; // Nếu phản hồi đã kết thúc, dừng việc gửi dữ liệu
            }

            if (!chunk?.answer) continue; // Bỏ qua nếu đoạn dữ liệu không chứa câu trả lời

            aiAnswer += decoder.decode(chunk.answer); // Giải mã và cộng dồn câu trả lời
            res.write(chunk.answer); // Gửi từng phần câu trả lời đến client
        }

        await addChat('AI', aiAnswer); // Lưu câu trả lời của AI vào lịch sử
    } catch (error) {
        console.log(error); // Ghi log nếu có lỗi
        res.status(500).send('Error during chat'); // Gửi phản hồi lỗi nếu có sự cố
    } finally {
        res.end(); // Kết thúc phản hồi sau khi hoàn thành hoặc khi gặp lỗi
    }
});

app.get('/history', async (req, res) => {
    const chats = await getChatHistory();
    res.json(chats);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
