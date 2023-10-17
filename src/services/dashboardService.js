import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const doctorAnalyticsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/dashboard/doctor", payload));
};

export const patientAnalyticsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/dashboard/patient", payload));
};
