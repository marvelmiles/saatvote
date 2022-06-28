import { useState, useRef, useEffect } from "react";
import axios, { handleCancelRequest } from "../api/axios";
import { debounce_leading, isObject } from "../helpers";

export const isTel = (str) => {
  return /\d+/i.test(str) ? "" : "Invalid phone number";
};

export const isEmail = (str) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    str
  )
    ? ""
    : "Invalid email address";
};

export const isPassword = (str, config = {}) => {
  if (config.encode === "hex") return this.isHexDecimal(str);
  if (config.encode === "digit") {
    let c = new RegExp(
      `^(\\d+){${config.min || 1},${config.max || config.min || 0}}$`,
      "g"
    );
    // console.log(c, "iooppp");
    return c.test(str);
  }
  return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
    str
  );
};

const useForm = (config = {}) => {
  config.validateOnChange =
    typeof config.validateOnChange === "boolean"
      ? config.validateOnChange
      : true;

  const formValidator = (eObj) => {
    let result;
    if (typeof config.formValidator === "function")
      result = config.formValidator(eObj);

    if (typeof result === "undefined")
      result = (() => {
        eObj = isObject(eObj) ? eObj : { value: eObj };
        if (eObj.type === "tel") {
          return {
            ...eObj,
            message: isTel(eObj.value),
          };
        } else if (eObj.type === "email") {
          return {
            ...eObj,
            message: isEmail(eObj.value),
          };
        } else if (eObj.type === "password") {
          return {
            ...eObj,
            message: isPassword(eObj.value, eObj),
          };
        } else if (!eObj.value) return eObj.message || null;
        return null;
      })();
    return result;
  };
  const [errors, setErrors] = useState({});
  const stateRef = useRef({
    hasSubmitted: false,
    values: {},
    inputMap: {},
    isSubmitting: false,
    // sometime the click event
    handleSubmit: (e) => {
      // combina
      e.preventDefault();
      debounce_leading(() => {
        let formData =
          typeof config.handleSubmit === "function"
            ? config.handleSubmit(
                Object.assign({}, stateRef.current.inputMap),
                formValidator
              )
            : {};
        if (!formData) return;
        console.log("submitting to endpoint...", formData);
        if (
          typeof config.onResponse === "function" &&
          !stateRef.current.isSubmitting
        ) {
          stateRef.current.isSubmitting = true;
          axios[(config.method || "post").toLowerCase()](
            config.endpoint,
            formData,
            config.config || {
              withCredentials: true,
            }
          )
            .then((res) => {
              config.onResponse(null, res.data);
            })
            .catch((err) => config.onResponse(err, null))
            .finally(() => (stateRef.current.isSubmitting = false));
        }
      })();
    },
  });
  // Avoid memory leakage with clean up fn rather than try catch finally...
  config.cleanup = (addon) => {
    stateRef.current.values = {};
    stateRef.current["cleanUp"] = addon;
    setErrors({});
  };
  config.setErrors = (errors) => setErrors((prev) => ({ ...prev, ...errors }));

  useEffect(() => {
    return () => handleCancelRequest();
  }, []);

  const handleChange = (e) => {
    e.persist();
    let value = e.target.type === "file";
    let name = e.target.name;
    value = value ? e.target.files : e.target.value;
    stateRef.current.values = {
      ...stateRef.current.values,
      [name]: value,
    };
    stateRef.current.inputMap[name] = {
      name,
      value,
      type: e.target.type,
      ...(config.inputMap ? config.inputMap[name] : {}),
    };
    if (config.validateOnChange) {
      let c = formValidator(stateRef.current.inputMap[name]); // encode,message

      setErrors((errors) => ({
        ...errors,
        [name]: c && c.message,
      }));
    } else setErrors((prev) => prev);
  };
  const handleSubmit = (e) => {
    // combina
    e.preventDefault();
    debounce_leading(() => {
      let formData =
        typeof config.handleSubmit === "function"
          ? config.handleSubmit(
              Object.assign({}, stateRef.current.inputMap),
              formValidator
            )
          : {};
      if (!formData) return;
      console.log("submitting to endpoint...", formData);
      if (
        typeof config.onResponse === "function" &&
        !stateRef.current.isSubmitting
      ) {
        stateRef.current.isSubmitting = true;
        axios[(config.method || "post").toLowerCase()](
          config.endpoint,
          formData,
          config.config || {
            withCredentials: true,
          }
        )
          .then((res) => {
            config.onResponse(null, res.data);
          })
          .catch((err) => config.onResponse(err, null))
          .finally(() => (stateRef.current.isSubmitting = false));
      }
    })();
  };
  return {
    handleChange,
    handleSubmit,
    errors,
    values: stateRef.current.values,
    hasSubmitted: stateRef.current.hasSubmitted,
    isSubmitting: stateRef.current.isSubmitting,
  };
};

export default useForm;
