import API from "../config/axiosConfig";
import { promiseHandler } from "../helper/promiseHandler";

export const fetchMedicalRecordsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/get", payload));
};

export const fetchRecordByAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/getById", payload));
};

export const fetchRecordByPatientIdAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/record/getByPatientId", payload)
  );
};

export const findDoctorsAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/findDoctor", payload));
};

export const shareRecordAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/share", payload));
};

export const multiShareRecordAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/multiShare", payload));
};

export const deleteRecordAPI = async (payload) => {
  return await promiseHandler(API.post("api/v1/record/del", payload));
};

export const addRecordAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/record/add", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

export const updateRecordAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/record/update", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

export const fetchSingleMedicalRecordAPI = async (payload) => {
  return await promiseHandler(
    API.post("api/v1/record/getsingle_record", payload)
  );
};
