import React, { useState, useEffect } from 'react';

// Define the structure of the poll data
interface PollData {
  question: string;
  options: {
    [key: string]: number;
  };
}

// CSS styles are embedded here to resolve the import error
const styles = `
  body {
    background-color: #282c34;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 20px;
  }

  .App {
    text-align: center;
  }

  .App-header {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }

  .poll-container {
    background-color: #3a404a;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .option-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .vote-button {
    background-color: #61dafb;
    border: none;
    color: #282c34;
    padding: 10px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.2s;
    min-width: 120px;
  }

  .vote-button:hover:not(:disabled) {
    background-color: #21a1f1;
    transform: translateY(-2px);
  }

  .vote-button:disabled {
    background-color: #555;
    color: #888;
    cursor: not-allowed;
  }

  .progress-bar-container {
    flex-grow: 1;
    background-color: #555;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    height: 38px;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    background-color: #61dafb;
    height: 100%;
    border-radius: 8px 0 0 8px;
    transition: width 0.5s ease-in-out;
  }

  .vote-count {
    position: absolute;
    left: 10px;
    right: 10px;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
  }

  .thank-you-message {
    margin-top: 20px;
    color: #61dafb;
    font-weight: bold;
  }

  .total-votes {
    margin-top: 20px;
    font-size: 1.2rem;
  }

  .loading {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;


function App() {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [voted, setVoted] = useState<boolean>(false);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket('ws://localhost:8000/ws');
    setSocket(ws);

    // Handle incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPollData(data);
    };

    // Clean up the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const handleVote = (option: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && !voted) {
      socket.send(JSON.stringify({ option }));
      setVoted(true); // Prevent multiple votes
    }
  };

  if (!pollData) {
    return <div className="loading">Connecting to server...</div>;
  }

  const totalVotes = Object.values(pollData.options).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="App">
        <header className="App-header">
          <h1>{pollData.question}</h1>
          <div className="poll-container">
            {Object.entries(pollData.options).map(([option, votes]) => {
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              return (
                <div key={option} className="option-wrapper">
                  <button
                    className="vote-button"
                    onClick={() => handleVote(option)}
                    disabled={voted}
                  >
                    {option}
                  </button>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="vote-count">{votes} votes ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
          {voted && <p className="thank-you-message">Thank you for voting!</p>}
          <p className="total-votes">Total Votes: {totalVotes}</p>
        </header>
      </div>
    </>
  );
}

export default App;

