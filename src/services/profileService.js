import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const profileUpdateAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/profile/", payload));
};

export const doctorSchedulerAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/profile/schedule", payload));
};

export const fetchDoctorProfileAPI = async (id) => {
  return await promiseHandler(API.post("api/v1/profile/doctor", { id }));
};

export const fetchProfileRatingsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/review/get", payload));
};

export const addProfilePicAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/profile/avatar", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
