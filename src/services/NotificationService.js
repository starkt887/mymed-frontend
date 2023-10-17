import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const fetchNotificationAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/notification/get", payload));
};

export const readNotificationAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/notification/read", payload));
};

export const sendNotificationAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/notification/generate", payload)
  );
};
