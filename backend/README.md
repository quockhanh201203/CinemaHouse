# Movie Auth Backend

Backend Express.js theo mô hình Route-Controller-Service, dùng MongoDB/Mongoose, JWT và bcrypt.

## Folder Structure

```txt
backend/
  package.json
  .env.example
  src/
    app.js
    server.js
    config/
      database.js
      env.js
    controllers/
      auth.controller.js
      movie.controller.js
    middlewares/
      auth.middleware.js
      error.middleware.js
    models/
      movie.model.js
      user.model.js
    routes/
      auth.routes.js
      movie.routes.js
    services/
      auth.service.js
      movie.service.js
    utils/
      api-error.js
      async-handler.js
      token.js
```

## Install

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Trên Windows PowerShell:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

Server mặc định chạy tại `http://localhost:5000`.

Route danh sách phim hiện được để public:

```js
router.get("/", movieController.listMovies);
```

Nếu muốn bắt buộc đăng nhập mới xem được danh sách phim, đổi thành:

```js
router.get("/", authenticate, movieController.listMovies);
```

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` requires JWT
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies` requires admin JWT

Response thành công:

```json
{
  "success": true,
  "data": {}
}
```

Response lỗi:

```json
{
  "success": false,
  "message": "Error message"
}
```
