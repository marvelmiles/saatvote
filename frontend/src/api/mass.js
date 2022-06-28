import axios from "./axios";
import { UNIT_PATH } from "../config";
import { createHmac, getCookie } from "../helpers";

export const getCategories = async () => {
  try {
    return (await axios.get(`${UNIT_PATH}/categories`)).data;
  } catch (err) {
    console.log(err.response?.data || err.message || err);
    return [];
  }
};

export const getVoteStatus = async () => {
  try {
    return await (
      await axios.get("/award/vote")
    ).data;
  } catch (err) {
    return "concluded";
  }
};

export const storeCookie = async (content, uid) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return axios.post(
    "/store-cookie",
    {
      content,
      uid: createHmac(uid, process.env.REACT_APP_API_KEY),
      maxAge: date,
      currentUid: createHmac(getCookie(), process.env.REACT_APP_API_KEY),
    },
    {
      headers: {
        authorization:
          "Bearer " +
          "f48d1c947ef3c6aa227a708272e64645ab4632cd2521e93054dd6cc44be34d59",
      },
    }
  );
};

export const getStoredCookie = async (uid) => {
  if (!uid) return;
  try {
    return (
      await axios.get(
        `/get-cookie/${createHmac(uid, process.env.REACT_APP_API_KEY)}`,
        {
          headers: {
            authorization:
              "Bearer " +
              "f48d1c947ef3c6aa227a708272e64645ab4632cd2521e93054dd6cc44be34d59",
          },
        }
      )
    ).data;
  } catch (err) {
    console.log(
      "Failure in getting stored cookie ",
      err.response?.data || err.message
    );
    return;
  }
};
