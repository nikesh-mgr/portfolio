# Portfolio Backend API Documentation

> **Project:** Developer Portfolio Backend
> **Stack:** Node.js, Express, MongoDB, Mongoose
> **Authentication:** JWT stored in HTTP-only Cookie
> **API Version:** v1

---

## 1. Base URL

### Development

```text
http://localhost:5000/api
```

### Production

```text
https://your-backend-domain.com/api
```

---

# 2. Authentication

Authentication uses a JWT stored in an **HTTP-only cookie**.

```text
Cookie:
accessToken=<JWT>
```

Frontend requests to protected routes must include credentials.

### Axios

```javascript
axios.defaults.withCredentials = true;
```

or:

```javascript
axios.get("/api/auth/me", {
  withCredentials: true,
});
```

> The frontend should **not** store or manually send the JWT using `localStorage` or an `Authorization` header.

---

# 3. Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Blog title is required"
    }
  ]
}
```

---

# 4. Health API

## GET `/health`

**Authentication:** Public

### Request

No body.

### Response `200`

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

# 5. Authentication APIs

Base route:

```text
/api/auth
```

---

## 5.1 Register Admin

### POST `/auth/register`

**Authentication:** Public

### Request

```json
{
  "name": "Nikesh Magar",
  "email": "admin@example.com",
  "password": "StrongPassword123!"
}
```

### Response `201`

```json
{
  "success": true,
  "message": "Admin account created successfully",
  "admin": {
    "id": "ADMIN_ID",
    "name": "Nikesh Magar",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 5.2 Login

### POST `/auth/login`

**Authentication:** Public

### Request

```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123!"
}
```

### Response `200`

```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "ADMIN_ID",
    "name": "Nikesh Magar",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Cookie

The backend automatically creates:

```text
accessToken=<JWT>
```

with:

```text
httpOnly: true
secure: production only
sameSite: lax (development)
sameSite: none (production)
```

---

## 5.3 Get Current Admin

### GET `/auth/me`

**Authentication:** Admin

### Request

No body.

The browser automatically sends:

```text
Cookie: accessToken=<JWT>
```

### Response `200`

```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "admin": {
    "id": "ADMIN_ID",
    "name": "Nikesh Magar",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 5.4 Logout

### POST `/auth/logout`

**Authentication:** Optional

### Request

No body.

### Response `200`

```json
{
  "success": true,
  "message": "Logout successful"
}
```

The backend removes the:

```text
accessToken
```

cookie.

---

# 6. Projects API

Base:

```text
/api/projects
```

---

## 6.1 Get All Projects

### GET `/projects`

**Authentication:** Public

### Query Parameters

```text
publishedOnly=true
```

Example:

```text
GET /api/projects?publishedOnly=true
```

### Response

```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "PROJECT_ID",
      "title": "Developer Portfolio",
      "slug": "developer-portfolio",
      "shortDescription": "Professional MERN portfolio",
      "description": "Full project description...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "githubUrl": "https://github.com/example/project",
      "liveUrl": "https://example.com",
      "featured": true,
      "published": true
    }
  ]
}
```

---

## 6.2 Get Project by ID

### GET `/projects/admin/:id`

**Authentication:** Admin

Example:

```text
GET /api/projects/admin/PROJECT_ID
```

### Response

```json
{
  "success": true,
  "project": {
    "_id": "PROJECT_ID",
    "title": "Developer Portfolio",
    "slug": "developer-portfolio"
  }
}
```

---

## 6.3 Get Project by Slug

### GET `/projects/:slug`

**Authentication:** Public

Example:

```text
GET /api/projects/developer-portfolio
```

---

## 6.4 Create Project

### POST `/projects`

**Authentication:** Admin

### JSON Request

```json
{
  "title": "Developer Portfolio",
  "shortDescription": "Professional MERN portfolio website",
  "description": "A full-stack portfolio application built with MERN.",
  "technologies": ["React", "Node.js", "Express", "MongoDB"],
  "githubUrl": "https://github.com/example/portfolio",
  "liveUrl": "https://example.com",
  "featured": true,
  "published": true
}
```

### With Image

Use:

```text
Content-Type: multipart/form-data
```

Fields:

```text
title
shortDescription
description
technologies
githubUrl
liveUrl
featured
published
featuredImage
```

---

## 6.5 Update Project

### PATCH `/projects/:id`

**Authentication:** Admin

### JSON Request

```json
{
  "title": "Updated Portfolio",
  "shortDescription": "Updated description",
  "published": true
}
```

### Response

```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {}
}
```

---

## 6.6 Delete Project

### DELETE `/projects/:id`

**Authentication:** Admin

### Response

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

# 7. Blog API

Base:

```text
/api/blogs
```

---

## 7.1 Get All Blogs

### GET `/blogs`

**Authentication:** Public

Example:

```text
GET /api/blogs
```

### Response

```json
{
  "success": true,
  "count": 1,
  "blogs": [
    {
      "_id": "BLOG_ID",
      "title": "Learning MERN Stack",
      "slug": "learning-mern-stack",
      "excerpt": "My experience learning MERN.",
      "content": "Blog content...",
      "coverImage": null,
      "tags": ["MERN", "JavaScript"],
      "category": "development",
      "published": true,
      "publishedAt": "2026-08-31T10:00:00.000Z",
      "readingTime": 5
    }
  ]
}
```

---

## 7.2 Get Blog by Slug

### GET `/blogs/:slug`

**Authentication:** Public

Example:

```text
GET /api/blogs/learning-mern-stack
```

### Response

```json
{
  "success": true,
  "blog": {
    "_id": "BLOG_ID",
    "title": "Learning MERN Stack",
    "slug": "learning-mern-stack",
    "excerpt": "My experience learning MERN.",
    "content": "Blog content..."
  }
}
```

---

## 7.3 Get Blog by ID

### GET `/blogs/admin/:id`

**Authentication:** Admin

Example:

```text
GET /api/blogs/admin/BLOG_ID
```

---

## 7.4 Create Blog

### POST `/blogs`

**Authentication:** Admin

### JSON Request

```json
{
  "title": "Learning MERN Stack",
  "excerpt": "My experience learning MERN.",
  "content": "This is my complete experience learning MERN Stack...",
  "tags": ["MERN", "JavaScript"],
  "category": "development",
  "published": true,
  "readingTime": 5
}
```

The backend automatically generates the slug from the title.

### With Featured Image

Use:

```text
Content-Type: multipart/form-data
```

Fields:

```text
title
excerpt
content
tags
category
published
readingTime
featuredImage
```

---

## 7.5 Update Blog

### PATCH `/blogs/:id`

**Authentication:** Admin

### Request

```json
{
  "title": "Updated MERN Article",
  "excerpt": "Updated excerpt",
  "content": "Updated blog content...",
  "published": true
}
```

### Response

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "blog": {}
}
```

---

## 7.6 Delete Blog

### DELETE `/blogs/:id`

**Authentication:** Admin

### Response

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

# 8. Contact API

Base:

```text
/api/contact
```

---

## 8.1 Send Contact Message

### POST `/contact`

**Authentication:** Public

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "I would like to discuss a development opportunity."
}
```

### Response

```json
{
  "success": true,
  "message": "Message sent successfully",
  "contact": {
    "_id": "CONTACT_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Opportunity"
  }
}
```

---

# 9. Certificates API

Base:

```text
/api/certificates
```

| Method | Endpoint            | Auth   |
| ------ | ------------------- | ------ |
| GET    | `/certificates`     | Public |
| GET    | `/certificates/:id` | Public |
| POST   | `/certificates`     | Admin  |
| PATCH  | `/certificates/:id` | Admin  |
| DELETE | `/certificates/:id` | Admin  |

### Create Certificate

```json
{
  "title": "MongoDB Developer Certification",
  "issuer": "MongoDB",
  "issueDate": "2026-08-01",
  "credentialUrl": "https://example.com/certificate"
}
```

---

# 10. Experience API

Base:

```text
/api/experiences
```

| Method | Endpoint           | Auth   |
| ------ | ------------------ | ------ |
| GET    | `/experiences`     | Public |
| GET    | `/experiences/:id` | Public |
| POST   | `/experiences`     | Admin  |
| PATCH  | `/experiences/:id` | Admin  |
| DELETE | `/experiences/:id` | Admin  |

### Create Experience

```json
{
  "company": "ABC Technologies",
  "position": "Full Stack Developer",
  "description": "Developed MERN applications.",
  "startDate": "2026-01-01",
  "endDate": null,
  "current": true
}
```

---

# 11. Skills API

Base:

```text
/api/skills
```

| Method | Endpoint      | Auth   |
| ------ | ------------- | ------ |
| GET    | `/skills`     | Public |
| GET    | `/skills/:id` | Public |
| POST   | `/skills`     | Admin  |
| PATCH  | `/skills/:id` | Admin  |
| DELETE | `/skills/:id` | Admin  |

### Create Skill

```json
{
  "name": "React",
  "category": "frontend",
  "level": 90,
  "order": 1
}
```

---

# 12. Education API

Base:

```text
/api/educations
```

| Method | Endpoint          | Auth   |
| ------ | ----------------- | ------ |
| GET    | `/educations`     | Public |
| GET    | `/educations/:id` | Public |
| POST   | `/educations`     | Admin  |
| PATCH  | `/educations/:id` | Admin  |
| DELETE | `/educations/:id` | Admin  |

### Create Education

```json
{
  "institution": "Pokhara University",
  "degree": "Bachelor of Computer Engineering",
  "field": "Computer Engineering",
  "startDate": "2024-01-01",
  "endDate": null,
  "current": true
}
```

---

# 13. Site Settings API

Base:

```text
/api/site-settings
```

## Get Settings

### GET `/site-settings`

**Authentication:** Public

---

## Update Settings

### PATCH `/site-settings`

**Authentication:** Admin

### Request

```json
{
  "siteTitle": "Nikesh Magar | Full Stack Developer",
  "siteDescription": "Full Stack MERN Developer",
  "email": "contact@example.com",
  "github": "https://github.com/example",
  "linkedin": "https://linkedin.com/in/example"
}
```

---

# 14. Resume API

Base:

```text
/api/resume
```

## Get Resume

### GET `/resume`

**Authentication:** Public

### Response

```json
{
  "success": true,
  "resume": {
    "url": "https://cloudinary.com/...",
    "originalName": "Nikesh-Magar-Resume.pdf"
  }
}
```

---

## Upload / Replace Resume

### PATCH `/resume`

**Authentication:** Admin

### Content Type

```text
multipart/form-data
```

### Field

```text
resume
```

Allowed:

```text
application/pdf
```

Maximum size:

```text
5 MB
```

---

## Delete Resume

### DELETE `/resume`

**Authentication:** Admin

### Response

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

# 15. File Upload API

Base:

```text
/api/upload
```

Use this section according to the exact upload routes implemented in the backend.

### Image Restrictions

```text
JPEG
PNG
WebP
Maximum: 5 MB
```

### Resume Restrictions

```text
PDF
Maximum: 5 MB
```

Files are uploaded to **Cloudinary**.

---

# 16. Authentication Error Responses

## Missing Token

### Status `401`

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Invalid Token

### Status `401`

```json
{
  "success": false,
  "message": "Invalid authentication token"
}
```

---

## Expired Token

### Status `401`

```json
{
  "success": false,
  "message": "Authentication token has expired"
}
```

---

## Non-Admin User

### Status `403`

```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

# 17. Common HTTP Status Codes

| Status | Meaning                            |
| ------ | ---------------------------------- |
| `200`  | Request successful                 |
| `201`  | Resource created                   |
| `400`  | Invalid request / validation error |
| `401`  | Authentication required/invalid    |
| `403`  | Forbidden                          |
| `404`  | Resource not found                 |
| `409`  | Duplicate resource                 |
| `429`  | Too many requests                  |
| `500`  | Internal server error              |

---

# 18. Frontend API Configuration

Recommended Axios configuration:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Production:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

# 19. Frontend Authentication Flow

```text
Login Form
    ↓
POST /auth/login
    ↓
Backend validates credentials
    ↓
JWT generated
    ↓
HTTP-only accessToken cookie
    ↓
Frontend receives admin data
    ↓
GET /auth/me when required
    ↓
Protected dashboard
```

The frontend never needs access to the JWT itself.

---

# 20. Frontend Protected Request

Example:

```javascript
const response = await api.post("/blogs", blogData);
```

Because Axios has:

```javascript
withCredentials: true;
```

the browser automatically sends:

```text
Cookie: accessToken=<JWT>
```

The frontend does **not** need:

```javascript
Authorization: `Bearer ${token}`;
```

---

# 21. Frontend Error Handling

Recommended:

```javascript
try {
  const response = await api.post("/blogs", blogData);

  console.log(response.data);
} catch (error) {
  const message = error.response?.data?.message || "Something went wrong";

  console.error(message);
}
```

For validation errors:

```javascript
const errors = error.response?.data?.errors || [];
```

Example:

```json
[
  {
    "field": "title",
    "message": "Blog title is required"
  }
]
```

---

# 22. API Security

The backend implements:

- JWT authentication
- HTTP-only authentication cookie
- CORS
- Helmet security headers
- Rate limiting
- Request validation
- MongoDB/Mongoose validation
- File upload restrictions
- Cloudinary storage
- Centralized error handling
- Production logging
- Environment variable validation

---

# 23. API Route Summary

| Resource      | Public             | Admin             |
| ------------- | ------------------ | ----------------- |
| Health        | GET                | —                 |
| Auth          | Login/Register     | Me/Logout         |
| Projects      | GET                | POST/PATCH/DELETE |
| Blogs         | GET                | POST/PATCH/DELETE |
| Contact       | POST               | —                 |
| Certificates  | GET                | POST/PATCH/DELETE |
| Experiences   | GET                | POST/PATCH/DELETE |
| Skills        | GET                | POST/PATCH/DELETE |
| Education     | GET                | POST/PATCH/DELETE |
| Site Settings | GET                | PATCH             |
| Resume        | GET                | PATCH/DELETE      |
| Upload        | According to route | Admin             |

---

# 24. Frontend Integration Rule

For every frontend feature, follow:

```text
UI Form
  ↓
Validate input
  ↓
Create request payload
  ↓
API request
  ↓
Backend validation
  ↓
Controller
  ↓
Service
  ↓
MongoDB / Cloudinary / Email
  ↓
Standard JSON response
  ↓
Update frontend state
  ↓
Show success/error message
```

This document should be treated as the **API contract between your React frontend and Express backend**.
