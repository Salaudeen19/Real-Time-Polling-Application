from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

# --- Application Setup ---
app = FastAPI()

# --- CORS Middleware ---
# Allows the frontend to communicate with this backend
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Data Store (for demonstration) ---
# A real application would use a database
poll_data = {
    "question": "What is your favorite programming language?",
    "options": {
        "Python": 0,
        "TypeScript": 0,
        "Go": 0,
        "Other": 0
    }
}

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()


# --- API Routes ---
@app.get("/")
def read_root():
    return {"message": "Polling App Backend is running"}

# --- WebSocket Endpoint ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial poll data when a client connects
        await websocket.send_text(json.dumps(poll_data))

        while True:
            # Wait for a vote from the client
            data = await websocket.receive_text()
            vote = json.loads(data)
            option = vote.get("option")

            # Update the vote count
            if option and option in poll_data["options"]:
                poll_data["options"][option] += 1
                # Broadcast the updated poll data to all clients
                await manager.broadcast(json.dumps(poll_data))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("A client disconnected.")
