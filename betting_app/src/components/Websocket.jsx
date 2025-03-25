import React, { useEffect, useState } from "react";

function Websocket() {
  const [oddsData, setOddsData] = useState({});

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        setOddsData(receivedData.data || {}); // Extract the 'data' field
      } catch (error) {
        console.error("Invalid JSON data received:", error);
      }
    };

    return () => socket.close();
  }, []);


  return (
    <div>
      <h1>Updated Odds & Rates</h1>
      {Object.keys(oddsData).length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Team</th>
              <th>Back Odds</th>
              <th>Lay Odds</th>
              <th>Back Rate</th>
              <th>Lay Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(oddsData).map(([team, odds]) => (
              <tr key={team}>
                <td>{team}</td>
                <td>{odds.Back_Odds}</td>
                <td>{odds.Lay_Odds}</td>
                <td>{odds.Back_Rate}</td>
                <td>{odds.Lay_Rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default Websocket;
