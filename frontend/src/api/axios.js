import axios from "axios";
import { BACKEND_URL, UNIT_PATH } from "../config";
import { getCookie, setCookieStore } from "../helpers";
import { createRedirectURL } from "./helpers";
import { v4 as uniq } from "uuid";
let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token) => {
  failedQueue.forEach((prom) => {
    if (err) {
      prom.reject(err);
    } else prom.resolve(token);
  });
  failedQueue = [];
};

let cancelRequest = [];
export const isTokenCancelled = axios.isCancel;
export const handleCancelRequest = (
  url = "pathname",
  msg = "Request was canceled"
) => {
  switch (url) {
    case "pathname":
      for (let i = 0; i < cancelRequest.length; i++) {
        cancelRequest[i].pathname === window.location.pathname &&
          cancelRequest[i].cancel(msg);
      }
      break;
    default:
      url = cancelRequest.find((req) => req.url === url);
      url && url.cancel(msg);
      break;
  }
};
// You can setup  config for post and get with defualt authorization header
const customInstance = axios.create({
  baseURL: BACKEND_URL + "/api",
});
customInstance.interceptors.request.use(function (config) {
  if (/post|get|put|delete/i.test(config.method)) {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...config.headers,
    };
  }
  if (config.headers["authorization"]) config.withCredentials = true;
  const source = axios.CancelToken.source(); // create new source token on every request
  source.url = config.url;
  source.pathname = window.location.pathname;
  config.cancelToken = source.token;
  cancelRequest.push(source);

  return config;
});
customInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    if (axios.isCancel(err)) return Promise.reject(err);

    console.log(err.config.url, "err request");
    const originalRequest = err.config;
    if (err.response?.status === 401) {
      console.log("401...");
      if (
        !originalRequest.role ||
        originalRequest._retry ||
        originalRequest._queued
      ) {
        console.log(
          "reject cos false role or queued or retrying",
          originalRequest.role,
          originalRequest._retry,
          originalRequest._queued
        );
        return Promise.reject("Encountered some error");
      }
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((jwtToken) => {
            originalRequest._queued = true;
            originalRequest.headers["authorization"] = "Bearer " + jwtToken;
            return customInstance.request(originalRequest);
          })
          .catch((_) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      return new Promise((resolve, reject) => {
        customInstance
          .get(
            `${UNIT_PATH}/${originalRequest.role.toLowerCase()}/refresh-token`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(({ data }) => {
            console.log(data, "new-jwtToken");
            setCookieStore({
              jwtToken: data,
            })
              .then(() => {
                processQueue(null, data);
                originalRequest.headers["authorization"] = "Bearer " + data;
                originalRequest.withCredentials = true;
                return resolve(customInstance.request(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                return reject(err);
              });
          })
          .catch((err) => {
            processQueue(err, null);
            return reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    } else if (err.response?.status === 403) {
      if (/\/u\/login/i.test(window.location.pathname))
        return Promise.reject(err);
      window.location.href = createRedirectURL();
    } else return Promise.reject(err);
  }
);

export default customInstance;
