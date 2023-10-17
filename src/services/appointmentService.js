import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const fetchAppointmentAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/appointment/", payload));
};

export const fetchAppointmentByIdAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/appointment/id", payload));
};

export const createAppointmentAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/appointment/add", payload));
};

export const findDoctorAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/appointment/find-doctor", payload)
  );
};

export const checkAppointmentAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/appointment/check", payload));
};

export const rescheduleAppointmentAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/appointment/reschedule", payload)
  );
};

export const addReviewAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/review/add", payload));
};
