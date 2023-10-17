import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const generatePubTokenAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/video/generate-pub-token", payload)
  );
};

export const generateSubTokenAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/video/generate-sub-token", payload)
  );
};

export const disconnectCallAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/video/disconnect", payload));
};
