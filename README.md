# Scalable Task Manager App (MERN Stack)

A full-stack task management dashboard with secure JWT authentication, profile management, and CRUD capabilities. Built with scalability and modularity in mind.

## 🚀 Features

- **Authentication:** Secure Login/Register with JWT & Bcrypt.
- **Dashboard:** Create, Edit, Delete, and Toggle status of tasks.
- **Search & Filter:** Real-time filtering by status and text search.
- **Security:** Protected routes, HTTP-only practices, and password hashing.
- **Responsive UI:** Clean, mobile-friendly interface.

## Tech Stack

- **Frontend:** React + Vite, Axios, CSS Modules.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose)

## How to Run Locally

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Scalability Note

To scale this application for production, I would implement the following strategies:

1. **Microservices Architecture:** Separate the **Auth logic** from the **Task logic** into distinct, independently deployable services. This decouples the application, allowing each service to scale based on its specific demand.
2. **Caching Layer:** Implement **Redis** to cache frequently accessed data (such as task lists or user profiles). This reduces the load on the primary database (MongoDB) and significantly improves API response times.
3. **Load Balancing:** Use **Nginx** as a reverse proxy and load balancer to distribute incoming traffic across multiple Node.js instances (clustering). This ensures high availability and allows the backend to handle concurrent requests more efficiently.

## 👨‍💻 Author

**Prem Kumar Dudi**

- GitHub: [@PREMKUMARDUDI](https://github.com/PREMKUMARDUDI)
- LinkedIn: [Connect with me](https://linkedin.com/in/dudipremkumar)

## 🙏 Acknowledgments

- React community for excellent component libraries
- MongoDB team for the flexible database solution
- Open source community for continuous learning

---
