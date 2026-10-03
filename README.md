# 🏺 Rachnika — Authentic Indian Handmade & Artisan Marketplace

**Rachnika** is a full-stack e-commerce platform built with Spring Boot and React to empower master folk artisans, ceramicists, and weavers across India. It provides a curated handcrafted storefront, custom multi-device session isolation, direct artisan studio support, and order tracking.

---

## ⚡ Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security (BCrypt Hashing), PostgreSQL, Maven
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Axios, Context API
- **Cloud & Deployment**: Render (Web Service, Static Site & Managed PostgreSQL)

---

## 🚀 Key Features

- **Artisan Catalog**: Dedicated categories for Madhubani folk paintings, terracotta clay pottery, macramé wall hangings, and botanical candles.
- **Account & Multi-Device Isolation**: Secure registration & login with Name, Mobile (+91), Email, and BCrypt-hashed passwords. Orders and delivery addresses are dynamically partitioned per user phone (`rachnika_orders_{phone}`).
- **Artisan Guild Account Hub**: Personalized "Kala Sanrakshak" guild patron badge, active session controls, saved delivery destinations, and studio options.
- **Payment & Checkout**: Integrated Razorpay modal, direct UPI QR code generation, simulated Card entry, Net Banking, and Cash on Delivery (COD) with captcha verification.
- **Printable Tax Invoices & Order Tracking**: Instant browser-generated GST tax invoice for handicraft goods (HSN 9701) and four-stage artisan dispatch tracking.
- **Studio Care & Messaging**: In-app artisan care desk to handle inquiries about fragile packaging, crafting timelines, and bespoke folk art commissions.
- **Seller Studio Portal**: Dedicated workspace for registered craftspersons to create, manage, and publish authentic handmade listings.

---

## 📂 Project Architecture
rachnika/
├── backend/
│   ├── src/main/java/com/rachnika/backend/
│   │   ├── controller/          # Auth, Product, Order, Payment Controllers
│   │   ├── dto/                 # Request & Response Contracts (ApiResponse envelope)
│   │   ├── entity/              # User, Product, Category, Order Entities
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   └── service/             # Auth, Product, Order, and Otp Services
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios configuration & API endpoints
│   │   ├── components/          # Navbar, Footer, ProductCard, CategoryBar
│   │   ├── context/             # CartContext, AuthContext
│   │   ├── pages/               # Storefront, Details, Cart, Checkout, Orders, Account, Login
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md

## 💻 Backend (Spring Boot) :
cd backend
mvnw.cmd spring-boot:run

## 💻 Frontend : 
cd frontend
npm run dev

## 💻 Local Setup & Installation

### 1. Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE rachnika_db;



