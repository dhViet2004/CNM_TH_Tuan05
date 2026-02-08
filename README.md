# Node.js CRUD MVC with DynamoDB Local

## Mô tả
CRUD theo mô hình MVC, sử dụng DynamoDB Local chạy bằng Docker. Bảng `Products` có các thuộc tính: `id`, `name`, `price`, `url_image`.

## Yêu cầu
- Node.js 18+
- Docker Desktop

## Cấu hình
Tạo file `.env` (đã có mẫu):
```
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_TABLE=Products
```

## Chạy DynamoDB Local + Admin + App (Docker Compose)
```
docker compose up --build -d
```

Truy cập:
- Web CRUD: http://localhost:3000/products
- DynamoDB Local: http://localhost:8000
- DynamoDB Admin: http://localhost:8001

## Cài dependencies
```
npm install
```

## Chạy ứng dụng (local, không dùng Docker)
```
npm run dev
```

## API (JSON)
- `GET /api/products` - lấy danh sách
- `GET /api/products/:id` - lấy theo id
- `POST /api/products` - tạo mới
- `PUT /api/products/:id` - cập nhật
- `DELETE /api/products/:id` - xoá

Body mẫu:
```
{
  "name": "Product A",
  "price": 100,
  "url_image": "https://example.com/image.png"
}
