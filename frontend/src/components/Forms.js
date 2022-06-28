import {
  AccountBox,
  Close,
  FilterAlt,
  Groups,
  HowToVote,
  Phone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Popover,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { isActiveStudent, logout } from "../api/user";
import { ROLE, POLLING_UNIT, UNIT_PATH } from "../config";
import {
  createPbk,
  getCookie,
  getCookieStore,
  setCookieStore,
} from "../helpers";
import useForm from "../hooks/useForm";
import LoginIcon from "@mui/icons-material/Login";
import { SlideLeft } from "./Animation";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uniq } from "uuid";
import { useSearchParams } from "react-router-dom";
import { useContext } from "../provider";
import { CircularProgress } from "../components/Animation";

/**
 * @NOTE Form components and useForm still in progress and lack validation.
 * Though work has expected you only have to change submition data manually.
 */

export const VoterLogin = ({ setAlertMsg, loginBtn }) => {
  let matNo = "voter-mat-no";
  let email = "voter-email";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let stateRef = useRef({
    setAlertMsg,
  });
  const [snackBar, setSnackBar] = useState({});
  stateRef = stateRef.current;
  const { handleChange, handleSubmit, values, errors } = useForm({
    endpoint: `/poll-unit/${POLLING_UNIT}/voter/auth/signin`,

    formValidator(value) {},
    handleSubmit(values, formValidator) {
      // awardStatus = "await";
      let formData = {};

      // if (awardStatus === "concluded")
      //   return stateRef.setAlertMsg(
      //     "Voting has ended. check your email or our homepage for result."
      //   );
      // else if (awardStatus === "await")
      //   return stateRef.setAlertMsg(
      //     "Sorry you can't login voting hasn't started."
      //   );
      formData["matNo"] = "are/17/1481";
      formData["email"] = "marvellousabidemi2@gmail.com";
      formData["pollingUnit"] = POLLING_UNIT;
      return formData;
    },
    async onResponse(err, data) {
      if (err) {
        setSnackBar({
          open: true,
          message: err.response?.data || err.message,
        });
        return;
      }
      try {
        data.role = ROLE.VOTER;
        data.isLogin = true;
        await setCookieStore(data);
        console.log((await getCookieStore())[getCookie()], "VOTER LOGIN");
        //learn
        navigate(searchParams.get("redirect_url") || "/");
      } catch (err) {
        console.log(err?.response?.data || err.message, "popppp");
      }
    },
  });
  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Input
          placeholder="Matric no"
          type="text"
          name={matNo}
          value={values[matNo] || ""}
          onChange={handleChange}
          sx={{
            borderColor: errors[matNo] ? "red" : "initital",
          }}
          startAdornment={
            <InputAdornment position="start">
              <AccountBox sx={{ fontSize: "24px", color: "primary.main" }} />
            </InputAdornment>
          }
        />
        <Input
          placeholder="Email"
          type="email"
          name={email}
          value={values[email] || ""}
          onChange={handleChange}
          sx={{
            borderColor: errors[email] ? "red" : "initital",
          }}
          startAdornment={
            <InputAdornment position="start">
              <Phone sx={{ fontSize: "24px", color: "primary.main" }} />
            </InputAdornment>
          }
        />
        {loginBtn}
      </Box>
      <Snackbar
        {...snackBar}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackBar({ ...snackBar, open: false })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        severity="info"
        TransitionComponent={SlideLeft}
      />
    </>
  );
};

export const ElectorateLogin = ({ loginBtn }) => {
  let pwd = "password";
  let email = "email";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [snackBar, setSnackBar] = useState({});
  const { handleChange, handleSubmit, values, errors } = useForm({
    endpoint: `${UNIT_PATH}/electorate/auth/signin`,
    formValidator(value) {},
    handleSubmit(values, formValidator) {
      let formData = {};
      formData["email"] = "bisolaAkinrinmola@gmail.com";
      formData["password"] = createPbk("bidemiAkinrinmola@123", 100);
      formData["pollingUnit"] = POLLING_UNIT;
      return formData;
    },
    async onResponse(err, data) {
      if (err) {
        console.log(err.response?.status, err.message);
        setSnackBar({
          open: true,
          message: err.response?.data || err.message,
        });
        return;
      }
      try {
        data.role = ROLE.ELECTORATE;
        data.isLogin = true;
        await setCookieStore(data);
        console.log(
          (await getCookieStore())[getCookie()].electorate.name,
          "ELEC LOGIN"
        );
        //learn
        navigate(searchParams.get("redirect_url") || "/me/dashboard/");
      } catch (err) {
        console.log(err?.response?.data || err.message);
      }
    },
  });
  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        {/* <TextInput
          placeholder="Email"
          type="email"
          name={email}
          value={values[email] || ""}
          onChange={handleChange}
          sx={{
            borderColor: errors[email] ? "red" : "initital",
          }}
          startAdornment={
            <InputAdornment position="start">
              <Phone sx={{ fontSize: "24px", color: "primary.main" }} />
            </InputAdornment>
          }
        />
        <TextInput
          placeholder="Password"
          type="password"
          name={pwd}
          value={values[pwd] || ""}
          onChange={handleChange}
          sx={{
            borderColor: errors[pwd] ? "red" : "initital",
          }}
          startAdornment={
            <InputAdornment position="start">
              <ROLEBox sx={{ fontSize: "24px", color: "primary.main" }} />
            </InputAdornment>
          }
        /> */}
        {loginBtn}
      </Box>
      <Snackbar
        {...snackBar}
        severity="info"
        TransitionComponent={SlideLeft}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackBar({ ...snackBar, open: false })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export const LoginForm = () => {
  const [logHas, setLogHas] = useState("voter");
  const [loading, setLoading] = useState(true);
  const _renderLoginForm = () => {
    const loginBtn = (
      <Button
        type="submit"
        variant="contained"
        sx={{
          borderRadius: 12,
          my: 2,
        }}
      >
        <IconButton>
          <LoginIcon sx={{ fontSize: "24px", color: "#fff" }} />
        </IconButton>
        <Typography component="span" noWrap variant="overline">
          Login
        </Typography>
      </Button>
    );
    if (logHas === "voter") return <VoterLogin loginBtn={loginBtn} />;
    else if (logHas === "electorate")
      return <ElectorateLogin loginBtn={loginBtn} />;
    return null;
  };

  useEffect(() => {
    (async () => {
      try {
        await logout();
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    })();
  }, []);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh", overflow: "auto" }}
        >
          <Paper
            elevation={12}
            sx={{
              p: 1,
              mt: 5,
              maxWidth: "500px",
              width: "90%",
              borderRadius: 5,
            }}
          >
            <Stack
              direction="row"
              sx={{
                display: "flex",
                width: "100%",
                maxWidth: "500px",
                mx: "auto",
                my: 2,
                flexWrap: {
                  xs: "wrap",
                  s400: "nowrap",
                },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  ..._styles.logHasButton,
                }}
                onClick={() => setLogHas("voter")}
              >
                <IconButton>
                  <HowToVote sx={{ fontSize: "24px", color: "#fff" }} />
                </IconButton>
                <Typography component="span" noWrap variant="overline">
                  Voter
                </Typography>
              </Button>
              <Button
                variant="contained"
                sx={{
                  ..._styles.logHasButton,
                }}
                onClick={() => setLogHas("electorate")}
              >
                <IconButton>
                  <Groups sx={{ fontSize: "24px", color: "#fff" }} />
                </IconButton>
                <Typography component="span" noWrap variant="overline">
                  Electorate
                </Typography>
              </Button>
            </Stack>
            {_renderLoginForm()}
          </Paper>
        </Stack>
      )}
    </>
  );
};

export const VerficationForm = (props) => {
  let code = "user-code";
  const navigation = useNavigate();
  const { values, errors, handleChange, handleSubmit } = useForm({
    endpoint: "/user/verification",
    errors: {
      [code]: "Code is required",
    },
    handleSubmit(values, formValidator, v) {
      let formData = {};
      // let code =   formValidator(v[code])
      // if() formData[code] = 'Verification '
      formData["otp"] = values[code];
    },
    onResponse(err, data) {
      if (err) {
        console.log(err?.response.data || err.message);
      }
      console.log(data);
    },
  });
  return (
    <>
      <Stack alignItems="center" justifyContent="center" sx={_styles.container}>
        <Stack
          justifyContent="center"
          component="form"
          sx={{
            ..._styles.paper,
            height: "90vh",
            maxHeight: "400px",
            overflow: "auto",
            boxShadow: 12,
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            component="h3"
            variant="h3"
            sx={{ color: "primary.main", maxWidth: "85%", mb: 1 }}
          >
            Submit verfication code sent to +2347019667900
          </Typography>

          <Input
            disableUnderline
            name={code}
            placeholder="Verfication code"
            sx={{
              ..._styles.input,
              mb: 0,
              borderColor: errors[code] ? "red" : "initial",
            }}
            value={values[code] || ""}
            onChange={handleChange}
            type="password"
            inputProps={{
              "data-max": "6",
              "data-type": "digit",
            }}
          />
          <Button
            sx={{
              textDecoration: "underline",
              alignSelf: "flex-start",
            }}
            disableRipple
          >
            Resend code
          </Button>
          <Button type="submit" variant="contained" sx={_styles.submitBtn}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export const SubscriptionForm = ({ styles = {} }) => {
  let email = "subscriber-email";
  const { values, errors, handleChange, handleSubmit } = useForm({
    endpoint: "/subscribe",
    handleSubmit(values, formValidator) {
      let formData = {};
      if (!values[email]) formData[email] = "Email is required";
      else {
        values[email] = formValidator(values[email]);
        if (values[email].message) formData[email] = values[email].message;
      }
      if (Object.keys(formData).length) return this.setErrors(formData);
      formData["email"] = values[email].value;
      return formData;
    },
    onResponse(err, data) {
      if (err) {
        console.log("errr", err?.response.data || err.message);
      }
      console.log(data);
    },
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ my: 3, ...styles.form, width: "100%" }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 0,
            color: "text.light",
            width: {
              xs: "100%",
            },
          }}
        >
          Subscribe to our newsletter
        </Typography>
        <Input
          sx={{
            ..._styles.input,
            my: 1,
            border: errors[email] ? "2px solid red" : "2px solid initial",
          }}
          placeholder="Email"
          disableUnderline
          value={values[email] || ""}
          name={email}
          type="email"
          onChange={handleChange}
        />
        <Button variant="contained" sx={_styles.submitBtn} type="submit">
          <Typography component="span" variant="h4">
            Subscribe
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export const CategoriesSearchFilter = ({
  categories = [],
  selected = {},
  onClose,
  onFilter,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const filterRef = useRef();
  return (
    <Box sx={{ width: "calc(100% - 40px)" }}>
      {!categories.length || !selected.name ? (
        <Box>
          <Skeleton animation="wave" height="10px" />
          <Skeleton animation="wave" height="10px" width="80%" />
          <Skeleton animation="wave" height="40px" />
        </Box>
      ) : (
        <Box>
          <Typography sx={{ maxWidth: "calc(100% - 40px)" }} variant="h4">
            {selected.name}
          </Typography>

          <Typography sx={{ maxWidth: "calc(100% - 40px)" }} variant="h4">
            {selected.nominees.length}
          </Typography>

          <Input
            sx={_styles.input}
            endAdornment={
              <InputAdornment onClick={() => setAnchorEl(filterRef.current)}>
                <FilterAlt ref={filterRef} sx={{ fontSize: "24px", mb: 1 }} />
              </InputAdornment>
            }
            onChange={(e) => {
              onFilter(
                "nominees",
                selected.nominees.filter((n) => {
                  return new RegExp(e.target.value, "gi").test(n.name);
                })
              );
            }}
          />
        </Box>
      )}

      <IconButton
        sx={{
          backgroundColor: "red",
          color: "#fff",
          alignSelf: "flex-end",
          position: "absolute",
          right: 0,
          top: 0,
          borderRadius: "initial",
        }}
        onClick={onClose}
      >
        <Close sx={{ fontSize: "24px" }} />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
      >
        <Box>kkkk</Box>
      </Popover>
    </Box>
  );
};

export const AddNominee = ({ header, formData, onFormData = () => {} }) => {
  const { cookie, setSnackMsg } = useContext();
  let name = "nominee-name";
  let gratitude = "nominee-gratitude";
  let category = "nominee-category";
  let whyMe = "nominee-whyMe";
  let avatar = "nominee-avatar";

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    hasSubmitted,
    isSubmitting,
  } = useForm({
    errors: {
      [name]: "Name is required",
      [gratitude]: "Gratitude is required",
      [category]: "Category is required",
      [whyMe]: "Why me is required",
    },
    method: formData ? "put" : "post",
    endpoint: formData
      ? `${UNIT_PATH}/category/${formData.category}/nominee/${formData.id}`
      : `${UNIT_PATH}/category/clique/nominee`,

    config: {
      headers: {
        Authorization: `Bearer ${cookie.jwtToken}`,
      },
      role: ROLE.ELECTORATE,
    },
    handleSubmit(values) {
      let _formData = {};

      _formData["name"] = uniq();
      _formData["gratitude"] = "Gratitude";
      _formData["whyMe"] = "WHY MY";
      _formData["name"] = uniq();
      _formData["pollingUnit"] = POLLING_UNIT;
      // _formData["category"] = "handsome-jj";
      _formData["createdBy"] = formData?.createdBy.id;
      return _formData;

      // if (!(typeof values[name] === "string" ? values[name] : formData?.name))
      //   _formData[name] = this.errors[name];
      // if (
      //   !(typeof values[gratitude] === "string"
      //     ? values[gratitude]
      //     : formData?.gratitude)
      // )
      //   _formData[gratitude] = this.errors[gratitude];
      // if (
      //   !(typeof values[category] === "string"
      //     ? values[category]
      //     : formData?.category)
      // )
      //   _formData[category] = this.errors[category];
      // if (
      //   !(typeof values[whyMe] === "string" ? values[whyMe] : formData?.whyMe)
      // )
      //   _formData[whyMe] = this.errors[whyMe];
      // if (Object.keys(_formData).length !== 0) return this.setErrors(_formData);

      // _formData = new FormData();
      // _formData.append("name", values[name] || formData.name);
      // _formData.append("gratitude", values[gratitude] || formData.gratitude);
      // _formData.append("category", values[category] || formData.category);
      // _formData.append("whyMe", values[whyMe] || formData.whyMe);

      // values[avatar] &&
      //   _formData.append("avatar", values[avatar] || formData.avatar);

      return _formData;
    },
    onResponse(err, data) {
      if (err) {
        return setSnackMsg(err.response?.data || err.message || err);
      }
      typeof onFormData === "function" &&
        formData &&
        onFormData(data, "nominee", "response");
      setSnackMsg(data);
      // setSnackMsg(data);
    },
  });
  const avatarRef = useRef();
  return (
    <>
      <Box sx={_styles.paper}>
        {header}
        <Box component="form" onSubmit={handleSubmit}>
          <Avatar
            sx={_styles.avatar}
            imgProps={{
              padding: "10px",
            }}
            onClick={() => avatarRef.current.click()}
          >
            <input
              multiple
              type="file"
              name={avatar}
              ref={avatarRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </Avatar>
          <Input
            disableUnderline
            placeholder="name"
            name={name}
            onChange={handleChange}
            value={
              hasSubmitted
                ? ""
                : typeof values[name] === "string"
                ? values[name]
                : formData
                ? formData.name
                : ""
            }
            sx={{
              borderColor: errors[name]
                ? "red !important"
                : "initial !important",
              ..._styles.input,
            }}
          />
          <Input
            disableUnderline
            placeholder="Gratitude"
            name={gratitude}
            onChange={handleChange}
            value={
              hasSubmitted
                ? ""
                : typeof values[gratitude] === "string"
                ? values[gratitude]
                : formData
                ? formData.gratitude
                : ""
            }
            sx={{
              borderColor: errors[gratitude]
                ? "red !important"
                : "initial !important",
              ..._styles.input,
            }}
          />
          <Input
            disableUnderline
            placeholder="wyMe"
            name={whyMe || ""}
            onChange={handleChange}
            value={
              hasSubmitted
                ? ""
                : typeof values[whyMe] === "string"
                ? values[whyMe]
                : formData
                ? formData.whyMe
                : ""
            }
            sx={{
              borderColor: errors[whyMe]
                ? "red !important"
                : "initial !important",
              ..._styles.input,
            }}
          />
          {/* <Dropdown list={[]} /> */}
          {formData ? (
            <Button
              type="submit"
              variant="contained"
              sx={_styles.submitBtn}
              disabled={!formData.name}
            >
              Update Nominee
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                ..._styles.submitBtn,
                border: isSubmitting ? "1px solid red" : "1px solid initial",
              }}
            >
              Nominate
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export const AddExecutive = ({ header, formData, onFormData }) => {
  const { cookie, setSnackMsg } = useContext();
  const avatarRef = useRef();
  let name = "executive-name";
  let post = "executive-post";
  let department = "executive-department";
  let avatar = "executive-avatar";
  const { handleChange, handleSubmit, values, errors, hasSubmitted } = useForm({
    errors: {
      [name]: "Name is required",
      [post]: "Post is required",
      [department]: "Department is required",
    },
    method: formData ? "put" : "post",
    endpoint: formData
      ? `${UNIT_PATH}/executive/${formData.id}`
      : `${UNIT_PATH}/executive`,
    validateOnChange: true,
    config: {
      headers: {
        Authorization: `Bearer ${cookie.jwtToken}`,
      },
    },
    handleSubmit(values) {
      let _formData = {};
      _formData["name"] = uniq();
      _formData["post"] = uniq();
      _formData["department"] = uniq();
      _formData["pollingUnit"] = POLLING_UNIT;
      return _formData;
      // if (!(typeof values[name] === "string" ? values[name] : formData?.name))
      //   _formData[name] = this.errors[name];
      // if (!(typeof values[post] === "string" ? values[post] : formData?.post))
      //   _formData[post] = this.errors[post];
      // if (
      //   !(typeof values[department] === "string"
      //     ? values[department]
      //     : formData?.department)
      // )
      //   _formData[department] = this.errors[department];

      // if (Object.keys(_formData).length !== 0) return this.setErrors(_formData);

      // _formData = new FormData();
      // _formData.append("name", values[name] || formData.name);
      // _formData.append("post", values[post] || formData.post);
      // _formData.append("department", values[department] || formData.department);
      // values[avatar] &&
      //   _formData.append("avatar", values[avatar] || formData.avatar);

      return _formData;
    },
    onResponse(err, data) {
      typeof onFormData === "function" &&
        onFormData(err || data, "executive", "response");
      if (err) return setSnackMsg(err.response?.data || err.message, 5000);
      setSnackMsg(data, 5000);
    },
  });
  return (
    <Box sx={_styles.paper}>
      {header}
      <Box component="form" onSubmit={handleSubmit}>
        <Avatar sx={_styles.avatar} onClick={() => avatarRef.current.click()}>
          <input
            multiple
            type="file"
            name={avatar}
            ref={avatarRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </Avatar>
        <Input
          disableUnderline
          name={name}
          placeholder="Executive name"
          onChange={handleChange}
          value={
            hasSubmitted
              ? ""
              : typeof values[name] === "string"
              ? values[name]
              : formData
              ? formData.name
              : ""
          }
          sx={{
            borderColor: errors[name] ? "red" : "initial",
            ..._styles.input,
          }}
        />
        <Input
          disableUnderline
          name={post}
          placeholder="Executive post"
          onChange={handleChange}
          value={
            hasSubmitted
              ? ""
              : typeof values[post] === "string"
              ? values[post]
              : formData
              ? formData.post
              : ""
          }
          sx={{
            borderColor: errors[post] ? "red" : "initial",
            ..._styles.input,
          }}
        />
        <Input
          disableUnderline
          name={department}
          placeholder="Executive department"
          onChange={handleChange}
          value={
            hasSubmitted
              ? ""
              : typeof values[department] === "string"
              ? values[department]
              : formData
              ? formData.department
              : ""
          }
          sx={{
            borderColor: errors[department] ? "red" : "initial",
            ..._styles.input,
          }}
        />
        {formData ? (
          <Button type="submit" variant="contained" sx={_styles.submitBtn}>
            Update executive
          </Button>
        ) : (
          <Button type="submit" variant="contained" sx={_styles.submitBtn}>
            Create executive
          </Button>
        )}
      </Box>
    </Box>
  );
};

const _styles = {
  logHasButton: {
    mx: 1,
    borderRadius: 12,
    my: {
      xs: 1,
    },
  },
  submitBtn: {
    borderRadius: 12,
    my: 2,
    p: 2,
  },
  paper: {
    p: 1,
    borderRadius: 5,
    maxWidth: "400px",
    backgroundColor: "#fff",
    boxShadow: 12,
    mx: "auto",
    my: 1,
  },
  container: {
    overflow: "auto",
    height: "100vh",
  },
  input: {
    border: "1px solid #45678d",
    borderRadius: 12,
    my: 2,
    p: 2,
    width: "100%",
    backgroundColor: "#fff",
  },
  avatar: {
    cursor: "pointer",
    mb: 1,
    mx: "auto",
    border: "1px solid green",
    width: "60px",
    height: "60px",
  },
};
