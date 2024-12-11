import axios from "axios";
import { initializeFeaturevisor } from "./featurevisor";

const checkBackendStatus = async () => {
  try {
    const response = await axios.get("http://localhost:5000/get-colors");
    return response.status === 200;
  } catch (error) {
    console.error("Backend is not reachable:", error);
    return false;
  }
};

const initFeaturevisorWithBackend = async () => {
  const backendActive = await checkBackendStatus();
  return initializeFeaturevisor(backendActive);
};

export const featurevisor = await initFeaturevisorWithBackend();
