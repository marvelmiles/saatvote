import { UNIT_PATH } from "../config";
import axios from "./axios";

export const getPollUnit = async (select = "") => {
  try {
    return (await axios.get(`${UNIT_PATH}?p=${select}`)).data;
  } catch (_) {
    return "await";
  }
};
