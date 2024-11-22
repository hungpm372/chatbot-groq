import fs from 'fs/promises';
const historyFile = './chat-history.json';


async function getChatHistory() {
    try {
        const data = await fs.readFile(historyFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Không thể đọc lịch sử chat:', error);
        return [];
    }
}


async function addChat(role, content) {
    try {
        const history = await getChatHistory();
        history.push({ role, content });
        await fs.writeFile(historyFile, JSON.stringify(history, null, 2), 'utf8');
    } catch (error) {
        console.error('Không thể lưu đoạn hội thoại:', error);
    }
}

async function getLast10Chats() {
    try {
        const history = await getChatHistory();
        return history.slice(-10);
    } catch (error) {
        console.error('Không thể lấy lịch sử chat:', error);
        return [];
    }
}

export { addChat, getLast10Chats, getChatHistory };
