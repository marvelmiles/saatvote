import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "./Animation";
import { useNavigate } from "react-router-dom";
import { createRedirectURL } from "../api/helpers";

function Redirect({ to, ...rest }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to || createRedirectURL(""), rest);
    console.log("naviagted away...");
  }, [to, navigate, rest]);
  return <CircularProgress />;
}

Redirect.propTypes = {};

export default Redirect;
