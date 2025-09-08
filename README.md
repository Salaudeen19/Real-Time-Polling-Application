#Real-Time Polling Application

##Overview
This is a full-stack web application that allows users to create polls and vote in real-time. It's built with a modern tech stack, focusing on performance, scalability, and a great user experience.
The application leverages WebSockets for instant updates, ensuring that poll results are synchronized across all connected clients without needing to refresh the page. This project serves as a practical demonstration of building a modern, interactive web service with a decoupled frontend and backend, containerized for consistent deployment.

##Core Technologies

- Backend: Python with FastAPI
- Frontend: TypeScript with React.js
- Real-Time Communication: WebSockets
- Deployment: Docker & Docker Compose

##Features

- Live Updates: Vote results change in real-time for all users.
- Dynamic UI: A clean and responsive user interface built with React.
- Scalable Backend: A high-performance asynchronous backend powered by Python and FastAPI.
- Containerized: Fully containerized with Docker for easy, reproducible deployment.

##Project Structure
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml

##Getting Started

To run this project locally, you will need Docker and Docker Compose installed.
1.Clone the repository:

git clone [https://github.com/your-username/real-time-polling-app.git](https://github.com/your-username/real-time-polling-app.git)
cd real-time-polling-app

2.Build and run the containers:

docker-compose up --build

3.Open your browser and navigate to http://localhost:8080 to see the application in action.
