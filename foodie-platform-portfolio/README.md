
# 🍔 Foodie – Role-Based Full-Stack Food Delivery Platform

Foodie is a **scalable, role-based full-stack food delivery platform** designed to handle real-world food ordering workflows.  
The system supports **Users, Restaurant Owners, Delivery Partners, and Admins**, each with **dedicated dashboards, role-based permissions, analytics, and workflows**.

This project demonstrates **end-to-end system design**, **secure JWT-based authentication**, **AI-powered features (including a chatbot assistant)**, **payment integration**, **performance optimization**, and a **microservices-based architecture**, making it suitable for **production-grade applications**.

---

## 🚀 Key Features

### 👤 User Dashboard
- Browse restaurants and menus  
- AI-powered speech-based food search  
- AI chatbot assistant for food discovery, order guidance, and FAQs  
- Cart validation and order placement  
- Live GPS order tracking  
- Order history & cancellations  
- Automated email notifications (order placed, shipped, delivered)  

---

### 🏪 Restaurant Owner Dashboard
- Restaurant onboarding  
- Menu creation, pricing control, and availability management  
- Accept / reject customer orders  
- Order status updates  
- Sales analytics with interactive graphs  
- Daily and monthly revenue tracking  
- Order trends to improve sales and operations  

---

### 🚴 Delivery Partner Dashboard
- Assigned order visibility  
- Live delivery tracking using GPS  
- Order pickup and delivery status transitions  
- Delivery history tracking  

---

### 🛠 Admin Dashboard
- Platform-wide monitoring and control  
- Advanced analytics dashboards  
- Revenue and commission tracking  
- User, restaurant, and delivery partner management  
- Performance insights to optimize platform growth  

---

## 🤖 AI & Chatbot Integration
- AI-powered chatbot assistant to help users:
  - Search food and restaurants  
  - Get order status and delivery updates  
  - Receive platform usage guidance and FAQs  
- Speech Recognition API for voice-based food search  
- Intelligent keyword processing to improve search accuracy  
- AI-assisted interactions for enhanced user experience  
- Optimized query handling for faster responses  

---

## 📊 Analytics & Monitoring
- Role-based dashboards with interactive charts and graphs  
- Admin-level platform analytics  
- Restaurant-level sales and order analytics  
- Revenue insights to analyze growth and improve sales  
- Pagination and optimized APIs for handling large datasets  

---

## 🔐 Security & Authentication
- JWT-based authentication  
- Role-Based Access Control (RBAC)  
- bcrypt password hashing  
- OTP-based email verification  
- Secure API communication using Axios interceptors  

---

## 💳 Payments & Integrations
- PayPal Sandbox payment gateway  
- Automated email notifications  
- AWS S3 for image and media storage  
- Redis caching for performance optimization  
- Optimized REST APIs with pagination  

---

## 🧩 Microservices Architecture

The backend follows a **microservices-based architecture** with a **centralized API Gateway**.

- Each core domain (Authentication, Orders, Restaurants, Delivery, Payments) is implemented as an **independent microservice**
- All external client requests are routed through the **API Gateway**
- Internal microservices communicate securely and are **not exposed publicly**
- Only a **single public port** is exposed for frontend communication  

### 🔄 Service Communication Flow

```text
Frontend (React)
      |
      v
API Gateway (Port 8080)
      |
      +--> Auth Service
      +--> Order Service
      +--> Restaurant Service
      +--> Delivery Service
      +--> Payment Service
````

---

## 🧰 Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS / Bootstrap
* Google Maps API (Live GPS tracking)
* Speech Recognition API (AI-powered search)
* Chatbot UI integration
* Chart libraries for analytics dashboards

---

### Backend

* Java Spring Boot
* RESTful APIs
* JWT Authentication
* Redis Cache
* AWS S3
* API Gateway (Microservices routing)

---

### Database

* PostgreSQL / MySQL
* MongoDB
* Redis (Caching)

---

## 📸 Application Screenshots

* User Dashboard
* Restaurant Owner Analytics
* Admin Analytics Dashboard
* Payment Flow
* AI Chatbot Interface

---

## ⚙️ Installation & Setup

### ✅ Prerequisites

* Java 17+
* Maven
* PostgreSQL / MySQL / MongoDB
* Redis (optional but recommended)

---

### 🔧 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 🌐 Backend Access (API Gateway)

```text
http://localhost:8080
```

**Note:**
All frontend requests are routed through the API Gateway.
Individual microservices run on internal ports and are not exposed directly.

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🎯 What This Project Demonstrates

* Real-world role-based system architecture
* Microservices with API Gateway
* AI-powered chatbot and intelligent user experience
* Secure authentication and authorization
* Payment gateway integration
* Analytics-driven decision making
* Performance optimization and scalability
* Clean and maintainable REST API design

---

## 👨‍💻 Author

**Mohammad Ghazi Abbas**  
Full Stack Developer | Java | React | Spring Boot

---

📌 *This project focuses on real-world scalability, AI-assisted interactions, analytics-driven growth, microservices architecture, and production-level system design.*  
📽 A detailed project presentation is included explaining system design, architecture, and workflows.

