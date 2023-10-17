import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const fetchPrescriptionsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/prescription/", payload));
};

export const fetchPrescriptionByIdAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/prescription/id/", payload));
};

export const generatePrescriptionAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/prescription/generate", payload)
  );
};

export const fetchMedicalInfoAPI = async () => {
  return await promiseHandler(API.get("api/v1/prescription/medinfo"));
};

export const miscellaneousAPI = async () => {
  return await promiseHandler(API.get("api/v1/prescription/misc"));
};
