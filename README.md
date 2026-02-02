# HƯỚNG DẪN CHẠY DỰ ÁN EVASHOES

## Cài đặt dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Chạy server

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server sẽ chạy tại: http://localhost:5001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Frontend sẽ chạy tại: http://localhost:5173
```

## API Endpoints

### Categories
- GET `/api/evashoes/categories/` - Lấy danh sách danh mục
- POST `/api/evashoes/categories/` - Tạo danh mục mới
- PUT `/api/evashoes/categories/:id` - Cập nhật danh mục
- DELETE `/api/evashoes/categories/:id` - Xóa danh mục

### Products
- GET `/api/evashoes/products/` - Lấy danh sách sản phẩm
- POST `/api/evashoes/products/` - Tạo sản phẩm mới
- PUT `/api/evashoes/products/:id` - Cập nhật sản phẩm
- DELETE `/api/evashoes/products/:id` - Xóa sản phẩm

## Cấu trúc dữ liệu

### Category
```json
{
  "_id": "ObjectId",
  "name": "String",
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Product
```json
{
  "_id": "ObjectId",
  "name": "String",
  "price": "Number",
  "sellPrice": "Number (Optional)",
  "description": "String",
  "productDetails": "String",
  "category": "ObjectId (Reference to Category)",
  "imageUrl": ["String"],
  "colors": [
    {
      "name": "String",
      "code": "String (hex color)",
      "image": "String (Optional)"
    }
  ],
  "sizes": [
    {
      "size": "Number",
      "stock": "Number"
    }
  ],
  "isSale": "Boolean",
  "isActive": "Boolean",
  "sold": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Giao diện Website

### Header
- Logo EVASHOES
- Menu navigation
- Icons (search, account, wishlist, cart)
- Top bar với thông tin liên lạc
- Promo bar

### Banner
- Hero section với hình ảnh và text
- CTA button

### Categories Section
- Grid hiển thị danh mục
- Hover overlay với button "Xem danh mục"
- Responsive design

### Products Section
- Grid hiển thị sản phẩm
- Filter tabs (Tất cả, Mới nhất, Bán chạy nhất, Được quan tâm)
- Product card với:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Đánh giá sao
  - Giá gốc và giá sale
  - Màu sắc khả dụng
  - Badge SALE (nếu có)
  - Add to cart button

### Footer
- Thông tin liên lạc
- Links điều hướng
- Form đăng ký newsletter
- Thông tin copyright

## Tính năng

✅ Fetch categories từ API
✅ Fetch products từ API
✅ Responsive design
✅ Beautiful UI theo trend 2024
✅ CORS enabled
✅ Format tiền tệ Việt Nam
✅ Product images placeholder
✅ Color display cho sản phẩm
✅ Sale badge
✅ Loading states

## Lưu ý

- Frontend sẽ gọi API từ `http://localhost:5001/api/evashoes/`
- Nếu API không hoạt động, sẽ sử dụng placeholder images
- Để add dữ liệu category/product, sử dụng Postman hoặc curl
- Database cần phải kết nối thành công

## Ví dụ thêm Category (Postman)
```
POST http://localhost:5001/api/evashoes/categories/
Content-Type: application/json

{
  "name": "Giày Cao Gót"
}
```

## Ví dụ thêm Product (Postman)
```
POST http://localhost:5001/api/evashoes/products/
Content-Type: application/json

{
  "name": "Giày Cao Gót Nữ Da Lộn",
  "price": 890000,
  "sellPrice": 650000,
  "description": "Giày cao gót sang trọng cho phụ nữ hiện đại",
  "productDetails": "Chất liệu: Da lộn, Chiều cao gót: 7cm",
  "category": "CATEGORY_ID_HERE",
  "imageUrl": ["https://via.placeholder.com/220x280"],
  "colors": [
    {
      "name": "Đen",
      "code": "#000000"
    },
    {
      "name": "Trắng",
      "code": "#FFFFFF"
    }
  ],
  "sizes": [
    {"size": 35, "stock": 5},
    {"size": 36, "stock": 8},
    {"size": 37, "stock": 10}
  ],
  "isSale": true,
  "sold": 45
}
```
