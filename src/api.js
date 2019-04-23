import axios from "axios";
import { HOST } from "@/config/myconfig";
export const addData = function(params) {
  return axios.post(`${HOST}/api/save`, params);
};

export const getData = function(params) {
  return axios.get(`${HOST}/api/get`, params);
};
