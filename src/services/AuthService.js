import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const signInAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/auth/signin", payload));
};

export const signUpAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/auth/signup", payload));
};

export const otpAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/auth/otp", payload));
};

export const forgotpasswordAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/auth/forgotpassword", payload));
};

export const verifyvlinkAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/auth/verifyvlink", payload));
};
