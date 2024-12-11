import React, { useEffect, useState, useRef } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { useColors } from "./ColorProvider";

function RecordingsPage() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const playerContainerRef = useRef(null);
  const colors = useColors();

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://41fp507pk8.execute-api.us-east-2.amazonaws.com/rrweb/recordings`);
      if (!response.ok) {
        throw new Error("Failed to fetch recordings");
      }
      const data = await response.json();
      setRecordings(data);
    } catch (error) {
      setError("Error fetching recordings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayRecording = async (recordingKey) => {
    try {
      setError(null);
      const response = await fetch(`https://41fp507pk8.execute-api.us-east-2.amazonaws.com/rrweb/recordings?sessionId=${recordingKey}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recording data");
      }

      const data = await response.json();
      const events = data.events;

      if (!events || events.length === 0) {
        throw new Error("No valid events data received");
      }

      setSelectedRecording(data);

      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';

        const containerWidth = playerContainerRef.current.clientWidth || 800;
        const containerHeight = Math.min(containerWidth * 0.5625, 600);

        new rrwebPlayer({
          target: playerContainerRef.current,
          props: {
            events,
            width: containerWidth,
            height: containerHeight,
            showController: true,
            autoPlay: true,
          },
        });
      }
    } catch (error) {
      setError("Error playing recording: " + error.message);
      console.error("Error playing recording:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className="container mt-4" 
        style={{ 
          backgroundColor: colors?.background || 'white', 
          color: colors?.page_font_color || 'black', 
          minHeight: '100vh', 
          paddingTop: '80px' 
        }}
      >
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="recordings-page" 
      style={{ 
        backgroundColor: colors?.background || 'white', 
        color: colors?.page_font_color || 'black', 
        minHeight: '100vh', 
        paddingTop: '80px' 
      }}
    >
      <div className="container">
        <h1 className="text-center mb-5">Session Recordings</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-md-4 mb-4">
            <h4 className="mb-3">Recording List</h4>
            <div className="list-group">
              {recordings.length === 0 ? (
                <div className="list-group-item text-muted">No recordings found</div>
              ) : (
                recordings.map((recording) => (
                  <button
                    key={recording.key}
                    className={`list-group-item list-group-item-action ${selectedRecording?.sessionId === recording.key ? 'active' : ''}`}
                    onClick={() => handlePlayRecording(recording.key)}
                  >
                    {new Date(recording.lastModified).toLocaleString()}
                    <small className="d-block text-muted">
                      {(recording.size / 1024).toFixed(1)} KB
                    </small>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="col-md-8">
            <div
              ref={playerContainerRef}
              className="border rounded"
              style={{
                minHeight: "400px",
                backgroundColor: colors?.navbar_color || 'lightgray',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!recordings.length && (
                <div className="text-muted">Select a recording to play</div>
              )}
            </div>

            {selectedRecording && (
              <div className="mt-3">
                <h5>Recording Details</h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Session ID</th>
                      <td>{selectedRecording.sessionId}</td>
                    </tr>
                    <tr>
                      <th>Timestamp</th>
                      <td>{new Date(selectedRecording.timeStamp).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th>Total Events</th>
                      <td>{selectedRecording.events.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordingsPage;