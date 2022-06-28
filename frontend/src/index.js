import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "react-fancy-countdown/dist/countdown.css";
import "react-multi-carousel/lib/styles.css";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";
import "draft-js/dist/Draft.css";
import "emoji-mart/css/emoji-mart.css";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
