import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker as DateTimePick } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

function DateTimePicker({
  timeRef,
  dateRef,
  dateTime = new Date(),
  onChange = () => {},

  error = false,
}) {
  const [errors, setErrors] = useState({});
  const [_dateTime, _setDateTime] = useState(dateTime);
  const classes = makeStyles({
    paper: {
      minWidth: "100% !important",
      width: "100% !important",
      maxWidth: "600px !important",
      margin: "0 16px !important",
      border: "1px solid red",
    },
  })();

  const handleChange = (dateTime, type) => {
    _setDateTime(dateTime);
    const date = new Date(dateTime.toString());
    const now = new Date();
    if (
      type === "date" &&
      (date.getFullYear() < now.getFullYear() ||
        date.getDate() < now.getDate() ||
        date.getMonth() < now.getMonth())
    ) {
      // console.log("date errorr");
      typeof onChange === "function" && onChange(dateTime, true, type);
      setErrors({
        ...errors,
        date: true,
      });
      return;
    } else if (
      type === "time" &&
      (date.getHours() < now.getHours() ||
        date.getMinutes() <= now.getMinutes())
    ) {
      // console.log("tim errorr");
      typeof onChange === "function" && onChange(dateTime, true, type);
      setErrors({
        ...errors,
        time: true,
      });
      return;
    }
    // console.log("reached change...");
    typeof onChange === "function" && onChange(dateTime, false, type);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack>
        <MobileDatePicker
          label={errors.date ? "Set a future date" : "Deadline date"}
          inputFormat="MM/D/yyyy"
          value={_dateTime}
          onChange={(dateTime) => handleChange(dateTime, "date")}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  ref: dateRef,
                }}
                error={errors.date}
                sx={{ my: 2 }}
              />
            );
          }}
          DialogProps={{
            classes,
            onClose: () => {},
          }}
        />

        <TimePicker
          label={errors.time ? "Set a future date" : "Deadline time"}
          value={_dateTime}
          onChange={(dateTime) => handleChange(dateTime, "time")}
          ampmInClock={true}
          ampm={false}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                ref: timeRef,
              }}
              erorr={errors.time}
              sx={{ my: 2 }}
            />
          )}
          DialogProps={{
            classes,
            onClose: () => {},
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}

DateTimePicker.propTypes = {};

export default DateTimePicker;
