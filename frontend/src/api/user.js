import axios from "../api/axios";
import { UNIT_PATH } from "../config";
import {
  getCookie,
  getCookieStore,
  isObject,
  setCookieStore,
} from "../helpers";

export const isActiveStudent = (str) => {
  let regex = /\w{3}\/(\d{2})\/\d{4}/,
    matchArr;
  if ((matchArr = regex.exec(str))) {
    return parseInt(matchArr[1]) + 7 <= new Date().getFullYear();
  }
  return false;
};

export const getExecutives = async () => {
  try {
    return (await axios.get(`${UNIT_PATH}/executives`)).data;
  } catch (_) {
    return [];
  }
};

export const logout = async (clearCookie = false) => {
  try {
    let cookie = getCookie();
    if (!cookie) {
      console.log("cookie not found");
      return;
    }
    console.log("loghasssss 1");
    await setCookieStore({ isLogin: false });
    console.log("loghasssss 2");
    const _cookie = (await getCookieStore())[cookie];
    console.log("loghasssss 3");
    if (!isObject(_cookie) || !_cookie.role) {
      console.log("Bad cookie content.", _cookie);
      return;
    }
    console.log("loghasssss 4");
    const res = (
      await axios.post(
        `${UNIT_PATH}/${_cookie.role.toLowerCase()}/auth/signout`,
        {
          isLogin: false,
        },
        {
          headers: {
            authorization: `Bearer ${_cookie.jwtToken}`,
          },
        }
      )
    ).data;
    console.log("loghasssss 5");
    if (clearCookie) {
      return res;
    }
    console.log("loghasssss 6");
    return res;
  } catch (err) {
    console.log("Logout: ", err.response?.data || err.message);
    return err.response?.data || err.message;
  }
};

export const getElectorates = async (select = "") => {
  try {
    return (await axios.get(`${UNIT_PATH}/electorates?p=${select}`)).data;
  } catch (_) {
    return [];
  }
};

export const getElectorate = async (id, select = "") => {
  try {
    return (
      (await axios.get(`${UNIT_PATH}/electorate/${id}?p=${select}`)).data || {
        ty: "empty",
      }
    );
  } catch (err) {
    console.log(err.response?.data || err.message || err);
    return {
      ty: "err",
    };
  }
};

export const voteNominee = async (nid, cid, cookie) => {
  try {
    return (
      await axios.put(`/poll/${nid}/${cid}`, cookie.voter, {
        headers: {
          authorization: `Bearer ${cookie.jwtToken}`,
        },
      })
    ).data;
  } catch (err) {
    return err?.response?.data || err.message;
  }
};
