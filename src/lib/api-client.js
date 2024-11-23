import axios from "axios";
import { HOST } from "./utils";

export const apiClient = axios.create({
  baseURL: HOST,
  //   withCredentials: true,
});
