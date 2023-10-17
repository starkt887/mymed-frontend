import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const createOrderAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/orders/createorder", payload));
};

export const verifyOrderAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/orders/verifyorder", payload));
};
