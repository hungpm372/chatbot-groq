import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf'
import { QdrantVectorStore } from '@langchain/qdrant'

const embeddings = new HuggingFaceInferenceEmbeddings({
    model: 'sentence-transformers/all-mpnet-base-v2',
    apiKey: process.env.HUGGINGFACE_API_KEY
});

const vectorStore = new QdrantVectorStore(
    embeddings,
    {
        url: process.env.QDRANT_ENDPOINT,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: 'chat-bot'
    }
);

export default vectorStore;
