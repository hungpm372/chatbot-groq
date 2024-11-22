import { ChatGroq } from '@langchain/groq'

const llm = new ChatGroq({
    model: 'llama-3.2-1b-preview',
    temperature: 0,
    streaming: true,
    apiKey: process.env.GROQ_API_KEY
});

export default llm;
