import React, { useEffect, useRef, useState } from "react";
import { record } from "rrweb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const SessionRecorder = () => {
  const eventsRef = useRef([]);
  const stopRecordingRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const sessionId = useRef(`${new Date().toISOString()}-${uuidv4()}`);
  const intervalRef = useRef(null);
  const isSavingRef = useRef(false);

  // Configure the S3 client (replace with your actual credentials)
  const s3 = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId:process.env.AWS_ACCESS_KEY ,
      secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY ,
    },
  });

  const saveEventsToS3 = async (forceSave = false) => {
    // Prevent multiple simultaneous save operations
    if (isSavingRef.current) return;
    if (eventsRef.current.length === 0) return;

    isSavingRef.current = true;

    try {
      const eventsToSave = [...eventsRef.current];
      eventsRef.current = []; // Clear the buffer after copying

      const params = {
        Bucket: "rrweb-recordings",
        Key: `events/${sessionId.current}-${Date.now()}.json`,
        Body: JSON.stringify({
          sessionId: sessionId.current,
          timeStamp: Date.now(),
          events: eventsToSave,
          forceSave: forceSave,
        }),
        ContentType: "application/json",
      };

      const command = new PutObjectCommand(params);
      console.log("params", params);
      await s3.send(command);
      console.log("Batch of events saved to S3:", params.Key);
    } catch (error) {
      console.error("Error saving batch of events to S3:", error);
      // Restore events if save fails
      eventsRef.current = [...eventsToSave];
    } finally {
      isSavingRef.current = false;
    }
  };

  // Handle page unload and visibility change
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      // Cancel the event to prevent immediate closure
      event.preventDefault();

      // Stop recording and save events
      if (stopRecordingRef.current) {
        stopRecordingRef.current();
      }

      // Force save remaining events
      await saveEventsToS3(true);

      // Show a message to the user
      event.returnValue = "Recording is being saved. Please wait...";
      return "Recording is being saved. Please wait...";
    };

    const startRecording = () => {
      if (stopRecordingRef.current) return;

      stopRecordingRef.current = record({
        emit(event) {
          eventsRef.current.push(event);
        },
      });

      setIsRecording(true);
      // Set up interval to save events every 30 seconds
      intervalRef.current = setInterval(saveEventsToS3, 10000 * 3);
    };

    const stopRecording = () => {
      if (!stopRecordingRef.current) return;

      stopRecordingRef.current();
      stopRecordingRef.current = null;
      setIsRecording(false);

      // Stop interval and save remaining events
      clearInterval(intervalRef.current);
      saveEventsToS3();
    };

    // Start recording on component mount
    startRecording();

    // Add event listeners for page unload and visibility change
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopRecording();
    };
  }, []);

  // Manual recording control
  const toggleRecording = async () => {
    if (isRecording) {
      if (stopRecordingRef.current) {
        stopRecordingRef.current();
        setIsRecording(false);
        clearInterval(intervalRef.current);
        await saveEventsToS3(); // Save any remaining events
      }
    } else {
      stopRecordingRef.current = record({
        emit(event) {
          eventsRef.current.push(event);
        },
      });
      setIsRecording(true);
      intervalRef.current = setInterval(saveEventsToS3, 30000);
    }
  };

  return (
    <div>
      <button onClick={toggleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default SessionRecorder;
