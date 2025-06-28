# Kitaabi Kidaa - Book Store API

A comprehensive book store API with user authentication, book management, shopping cart, and favorites functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication with signup/signin
- **Book Management**: CRUD operations for books (admin only)
- **Shopping Cart**: Add/remove books from cart
- **Favorites**: Add/remove books from favorites
- **Role-based Access**: User and admin roles
- **Input Validation**: Zod schema validation
- **API Testing**: Comprehensive test suite with Jest and Supertest
- **CI/CD Pipeline**: GitHub Actions with Keploy API testing
- **OpenAPI Documentation**: Complete API specification

## 📋 API Endpoints

### Authentication

- `POST /api/v1/signup` - Register new user
- `POST /api/v1/signin` - User login

### User Management

- `GET /api/v1/userInfo` - Get user information
- `PUT /api/v1/update_address` - Update user address

### Book Management (Admin Only)

- `POST /api/v1/addbook` - Add new book
- `PUT /api/v1/updatebook/:bookId` - Update book
- `DELETE /api/v1/deletebook/:bookId` - Delete book
- `GET /api/v1/allbooks` - Get all books (public)

### Cart Management

- `PUT /api/v1/addtocart/:bookId` - Add book to cart
- `PUT /api/v1/removefromcart/:bookId` - Remove book from cart

### Favorites Management

- `PUT /api/v1/addtofavourites/:bookId` - Add book to favorites
- `PUT /api/v1/removefromfavourites/:bookId` - Remove book from favorites

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kitaabi-kidaa.git
cd kitaabi-kidaa
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=3000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/kitaabi-kidaa
```

4. Start MongoDB:

```bash
mongod
```

5. Run the application:

```bash
npm start
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### API Tests with Keploy

```bash
# Install Keploy
curl -fsSL https://get.keploy.io | sh

# Record API interactions
keploy record --config-path .keploy/config.yaml

# Run tests
keploy test --config-path .keploy/config.yaml
```

### Manual API Testing

```bash
# Health check
curl http://localhost:3000/

# User signup
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","address":"123 Test Street"}'

# User signin
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all books
curl http://localhost:3000/api/v1/allbooks
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with GitHub Actions:

### Pipeline Stages:

1. **Test**: Run unit tests and API tests
2. **Keploy Record**: Record API interactions for testing
3. **Deploy**: Deploy to production (on main branch)

### Pipeline Features:

- MongoDB service container
- Node.js 18 environment
- Keploy API testing integration
- Automatic deployment on main branch
- Post-deployment health checks

## 📚 API Documentation

### OpenAPI Schema

The complete API specification is available in `openapi.yaml` and includes:

- All endpoints with request/response schemas
- Authentication requirements
- Error responses
- Data validation rules

### Interactive Documentation

You can view the interactive API documentation by:

1. Opening `openapi.yaml` in Swagger UI
2. Using tools like Postman with the OpenAPI import

## 🏗️ Project Structure

```
kitaabi-kidaa/
├── .github/workflows/     # CI/CD pipeline
├── .keploy/              # Keploy configuration
├── db/
│   ├── models/           # Database models
│   └── sever.js          # Database connection
├── routes/               # API routes
├── screenshots/          # API testing screenshots
├── api.test.js          # Comprehensive test suite
├── index.js             # Main application file
├── openapi.yaml         # API specification
└── package.json         # Dependencies and scripts
```

## 🔐 Environment Variables

| Variable      | Description               | Default  |
| ------------- | ------------------------- | -------- |
| `PORT`        | Server port               | 3000     |
| `JWT_SECRET`  | JWT signing secret        | Required |
| `MONGODB_URI` | MongoDB connection string | Required |

## 🧪 Test Coverage

The test suite covers:

- ✅ Authentication endpoints
- ✅ User management
- ✅ Book CRUD operations
- ✅ Cart functionality
- ✅ Favorites functionality
- ✅ Error handling
- ✅ Input validation
- ✅ Authorization checks

## 🚀 Deployment

### Prerequisites

- Node.js 18+
- MongoDB
- Environment variables configured

### Production Deployment

1. Set up environment variables
2. Install dependencies: `npm ci`
3. Start the application: `npm start`
4. Configure reverse proxy (nginx/apache)
5. Set up SSL certificates

## 📊 API Testing Results

### Keploy Dashboard Screenshots

![API Testing Dashboard](screenshots/keploy-dashboard.png)

### Test Coverage Report

- **Total Endpoints**: 15
- **Test Coverage**: 100%
- **Authentication**: ✅
- **Authorization**: ✅
- **Data Validation**: ✅
- **Error Handling**: ✅

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Email: vipulsingh.1404@gmail.com

## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/kitaabi-kidaa)
- [API Documentation](https://yourusername.github.io/kitaabi-kidaa)
- [Keploy Dashboard](https://cloud.keploy.io)

---

**Note**: This project is part of the API Testing with AI & CI/CD Integration learning path. The CI/CD pipeline includes Keploy API testing for automated test generation and validation.
