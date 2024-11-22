# Chat Application with AI Integration

Ứng dụng chat tích hợp AI sử dụng Express.js và LangChain, hỗ trợ streaming response và vector store cho việc truy xuất thông tin thông minh.

## Tính năng chính

- Chat realtime với AI sử dụng GROQ
- Vector store với Qdrant cho việc lưu trữ và truy xuất thông tin
- Tích hợp HuggingFace cho các tính năng AI bổ sung
- Streaming response để hiển thị câu trả lời ngay lập tức
- Lưu trữ lịch sử chat
- Giao diện người dùng thân thiện
- Hỗ trợ training dữ liệu mới

## Yêu cầu hệ thống

- Node.js (v18.0.0 trở lên)
- NPM hoặc Yarn
- Tài khoản GROQ API
- Tài khoản Qdrant Cloud
- Tài khoản HuggingFace

## Cài đặt

1. Clone repository:
```bash
git clone [https://github.com/hungpm372/chatbot-groq]
cd [chatbot-groq]
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```bash
touch .env
```

4. Cấu hình các API keys trong file .env:
```plaintext
# GROQ API Configuration
GROQ_API_KEY=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

# HuggingFace Configuration
HUGGINGFACE_API_KEY=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

# Qdrant Vector DB Configuration
QDRANT_API_KEY=6eUYINo0Tot1kL5e2N7ci3TMHtKT9150UpSfSyOLhsgcdFm0PdImMA
QDRANT_ENDPOINT=https://80708b0b-2067-419d-8c31-491e5f8d7f53.us-east4-0.gcp.cloud.qdrant.io:6333

# Server Configuration
PORT=3000
```

## Khởi chạy ứng dụng

1. Chạy ở môi trường development:
```bash
node server.js
```

2. Chạy ở môi trường production:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Training dữ liệu

1. Chuẩn bị file dữ liệu `data.json` theo định dạng yêu cầu

2. Gọi API training:
```bash
curl http://localhost:3000/training
```

hoặc truy cập trực tiếp đường dẫn `http://localhost:3000/training` trên trình duyệt

## API Endpoints

### 1. Chat API
- **URL:** `/chat`
- **Method:** POST
- **Body:**
```json
{
    "question": "Câu hỏi của người dùng"
}
```
- **Response:** Stream của câu trả lời

### 2. Training API
- **URL:** `/training`
- **Method:** GET
- **Response:** Thông báo kết quả training

### 3. History API
- **URL:** `/history`
- **Method:** GET
- **Response:** Danh sách lịch sử chat

## Cấu hình Services

### 1. GROQ Configuration
- Đăng ký tài khoản tại [GROQ](https://console.groq.com)
- Tạo API key và thêm vào file .env
- GROQ được sử dụng cho việc xử lý ngôn ngữ tự nhiên và tạo phản hồi

### 2. Qdrant Configuration
- Tạo tài khoản tại [Qdrant Cloud](https://cloud.qdrant.io/)
- Tạo collection mới và lấy API key
- Qdrant được sử dụng như một vector database để lưu trữ và truy xuất thông tin

### 3. HuggingFace Configuration
- Đăng ký tại [HuggingFace](https://huggingface.co)
- Tạo API key và thêm vào file .env
- HuggingFace được sử dụng cho các tính năng AI bổ sung

## Cấu trúc thư mục

```
├── public/
│   └── index.html
├── model.js          # GROQ model configuration
├── prompt.js         # System prompts
├── vector-store.js   # Qdrant configuration
└── chat-history.js   # Chat history management
├── .env
├── data.json
├── chat-history.json
├── .gitignore
├── package.json
└── server.js
```

## Testing

1. Chạy unit tests:
```bash
npm test
```

2. Chạy integration tests:
```bash
npm run test:integration
```

## Xử lý lỗi thường gặp

1. **Lỗi kết nối GROQ API:**
   - Kiểm tra GROQ_API_KEY trong file .env
   - Đảm bảo kết nối internet ổn định
   - Kiểm tra quota sử dụng

2. **Lỗi Qdrant:**
   - Xác nhận QDRANT_API_KEY và QDRANT_ENDPOINT chính xác
   - Kiểm tra kết nối đến Qdrant cloud
   - Đảm bảo collection đã được tạo

3. **Lỗi HuggingFace:**
   - Xác thực HUGGINGFACE_API_KEY
   - Kiểm tra quyền truy cập các model cần thiết

4. **Lỗi streaming:**
   - Kiểm tra kết nối mạng
   - Đảm bảo client hỗ trợ streaming

## Security

- Không commit file .env vào repository
- Sử dụng HTTPS cho production
- Thiết lập rate limiting cho API endpoints
- Thường xuyên cập nhật API keys
- Monitoring các API calls và usage

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Project được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.

## Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:
- Tạo issue trong repository
- Liên hệ qua email: [hungpm372@gmail.com]
- Tham khảo documentation