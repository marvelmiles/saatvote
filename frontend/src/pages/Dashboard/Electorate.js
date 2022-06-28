import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DrawerSlide from "../../components/DrawerSlide";
import { useContext } from "../../provider";
import { AddExecutive, AddNominee } from "../../components/Forms";
import {
  CheckCircleOutline,
  HowToVote,
  Person,
  RemoveCircleOutline,
} from "@mui/icons-material";
import Executives from "../../components/Executives.js";
import { getElectorate, getExecutives, logout } from "../../api/user";
import { useNavigate } from "react-router";
import { CircularProgress } from "../../components/Animation";
import CategoryFilter from "../../components/CategoryFilter";
import { getElectorates } from "../../api/user";
import Header from "../../components/Header";
import axios, { handleCancelRequest } from "../../api/axios";
import { ROLE, UNIT_PATH } from "../../config";
import DateTimePicker from "../../components/DateTimePicker";
import { useSearchParams } from "react-router-dom";
import Redirect from "../../components/Redirect";
import { setCookieStore } from "../../helpers";

export const ApprovalMonitor = ({ electorate }) => {
  const { socket, cookie, setDialogProps, closeDialog, setSnackMsg } =
    useContext();
  const [electorates, setElectorates] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeRef = useRef();
  const dateRef = useRef();
  let stateRef = useRef({});
  stateRef = stateRef.current;
  const getDate = (date) => {
    date = new Date(date);
    const mths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${mths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  useEffect(() => {
    (async () => {
      try {
        const electorates = await getElectorates();
        stateRef.setVotingTime = electorates.length
          ? electorate.chairperson &&
            electorates.every((e) => e.approvedVotingOn)
          : false;
        setElectorates(electorates);
        setLoading(false);
      } catch (err) {}
    })();
  }, [electorate]);
  useEffect(() => {
    socket.disconnected && socket.connect();
    // calling off before on invoke callback or listen just once for every server emit
    socket.on("electorate-update", (elec, reason) => {
      console.log("electorate update...", reason);
      setElectorates((prev) => {
        let arr = [], // creating a new arr object causes re-rendering; which is needed
          index = 0;
        for (let i = 0; i < prev.length; i++) {
          prev[i].approvedVotingOn && index++;
          if (electorate.chairperson && index === prev.length)
            stateRef.setVotingTime = true;
          else stateRef.setVotingTime = false;
          prev[i].id === elec.id && (prev[i] = elec);
          arr.push(prev[i]);
        }
        return arr;
      });
    });
  }, [socket, electorate]);
  return (
    <Box sx={_styles.paper}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {electorates.length ? (
            <>
              <List
                sx={{
                  overflow: "auto",
                }}
              >
                {electorates.map((elec, i) => {
                  return (
                    <ListItem
                      alignItems="flex-start"
                      key={i}
                      secondaryAction={
                        elec.chairperson ? (
                          <Tooltip title="Chair-person">
                            <IconButton>
                              <Person
                                sx={{
                                  fontSize: "24px",
                                  cursor: "pointer",
                                  color: "primary.main",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : electorate.chairperson ? (
                          elec.id === electorate.id ? (
                            <Tooltip title="Chair-person">
                              <IconButton>
                                <Person
                                  sx={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "primary.main",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : elec.approvedVotingOn ? (
                            <Tooltip title="Approved voting schedule">
                              <IconButton>
                                <HowToVote
                                  sx={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "primary.main",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : elec.approvedOn ? (
                            <Tooltip title="Revoke approval">
                              <IconButton
                                onClick={async () => {
                                  try {
                                    setSnackMsg(
                                      (
                                        await axios.post(
                                          `${UNIT_PATH}/electorate/${elec.id}/revoke-approval`,
                                          {},
                                          {
                                            role: ROLE.ELECTORATE,
                                            headers: {
                                              authorization:
                                                `Bearer ` + cookie.jwtToken,
                                            },
                                          }
                                        )
                                      ).data
                                    );
                                  } catch (err) {
                                    setSnackMsg(
                                      err.response?.data || err.message || err
                                    );
                                  }
                                }}
                              >
                                <RemoveCircleOutline
                                  sx={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "primary.main",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : elec.requestedOn ? (
                            <Tooltip title="Approve data submittion">
                              <IconButton
                                onClick={async () => {
                                  try {
                                    setSnackMsg(
                                      (
                                        await axios.post(
                                          `${UNIT_PATH}/electorate/${elec.id}/approve-nominations`,
                                          {},
                                          {
                                            headers: {
                                              authorization: `Bearer ${cookie.jwtToken}`,
                                            },
                                          }
                                        )
                                      ).data
                                    );
                                  } catch (err) {
                                    setSnackMsg(
                                      err.response?.data || err.message
                                    );
                                  }
                                }}
                              >
                                <CheckCircleOutline
                                  sx={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "primary.main",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Await approval request">
                              <IconButton>
                                <CheckCircleOutline
                                  sx={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "red",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : elec.approvedVotingOn ? (
                          <Tooltip title="Approved voting schedule">
                            <IconButton>
                              <HowToVote
                                sx={{
                                  fontSize: "24px",
                                  cursor: "pointer",
                                  color: "primary.main",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : null
                      }
                    >
                      <Tooltip
                        title={`Electorate ${elec.name}`}
                        placement="right"
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ width: 50, height: 50 }}
                            alt={elec.avatar.alt}
                            src={elec.avatar.src}
                          />
                        </ListItemAvatar>
                      </Tooltip>
                      <ListItemText
                        primary={
                          <>
                            <Stack
                              alignItems="center"
                              direction="row"
                              justifyContent="space-between"
                            >
                              {elec.approvedOn
                                ? `Approved - ${getDate(elec.approvedOn)}`
                                : "Await - Nominees submition ongoing"}
                              {/* <Button></Button> */}
                            </Stack>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ wordBreak: "break-word" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Created
                              {elec.categoryCount >= 2
                                ? ` ${elec.categoryCount} categories,`
                                : ` ${elec.categoryCount} category,`}
                              {elec.nomineeCount >= 2
                                ? ` ${elec.nomineeCount} nominees `
                                : ` ${elec.nomineeCount} nominee `}
                              and
                              {elec.executiveCount >= 2
                                ? ` ${elec.executiveCount} executives `
                                : ` ${elec.executiveCount} executive `}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </>
          ) : (
            <Box>No electorate to monitor</Box>
          )}
          <Box>
            {electorate.chairperson ? (
              <Button
                variant="contained"
                disabled={!stateRef.setVotingTime}
                sx={_styles.submitBtn}
                onClick={() => {
                  let date = new Date();
                  // date.setHours(date.getHours() + 1);
                  date.setMinutes(date.getMinutes() + 1);
                  let hasError = false;
                  setDialogProps({
                    open: true,
                    header: (
                      <Typography variant="h4" component="h4">
                        Set voting timeline
                      </Typography>
                    ),
                    content: (
                      <DateTimePicker
                        dateTime={date}
                        timeRef={timeRef}
                        dateRef={dateRef}
                        onChange={(dateTime, error) => (hasError = error)}
                      />
                    ),
                    footer: (
                      <Box>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${UNIT_PATH}/poll`,
                                {
                                  dueTime: timeRef.current.value,
                                  dueDate: dateRef.current.value,
                                },
                                {
                                  headers: {
                                    authorization: `Bearer ${cookie.jwtToken}`,
                                  },
                                }
                              );
                              closeDialog();
                            } catch (err) {
                              setSnackMsg(err.response?.data || err.message);
                            }
                          }}
                        >
                          Ok
                        </Button>
                      </Box>
                    ),
                    styles: {
                      paper: {
                        height: "auto",
                      },
                    },
                  });
                }}
              >
                Schedule vote
              </Button>
            ) : electorate.approvedOn ? (
              <Button
                variant="contained"
                sx={_styles.submitBtn}
                onClick={() => {
                  setDialogProps({
                    header: <Typography>Approve voting?</Typography>,
                    content: (
                      <Box>
                        Do you want to grant permission to the chairperson to
                        schedule voting timeline? Action is not reversible and
                        you won't be permitted to edit or add executive or
                        nominate nominee
                      </Box>
                    ),
                    footer: (
                      <Box>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button
                          onClick={async () => {
                            try {
                              await axios.post(
                                `${UNIT_PATH}/electorate/${electorate.id}/approve-voting`,
                                {},
                                {
                                  headers: {
                                    authorization: `Bearer ${cookie.jwtToken}`,
                                  },
                                }
                              );
                              closeDialog();
                            } catch (err) {
                              setSnackMsg(err.response?.data || err.message);
                            }
                          }}
                        >
                          Agree
                        </Button>
                      </Box>
                    ),
                    styles: {
                      paper: {
                        height: "auto",
                      },
                    },
                  });
                }}
                disabled={electorate.approvedVotingOn}
              >
                Approve voting
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={_styles.submitBtn}
                onClick={() =>
                  setDialogProps({
                    open: true,
                    content: (
                      <Box>
                        You will be denied from nominating or adding new
                        executive
                      </Box>
                    ),
                    header: <Typography> Approve voting process</Typography>,
                    footer: (
                      <>
                        <Button onClick={closeDialog}>Disagree</Button>
                        <Button
                          onClick={async () => {
                            try {
                              const requestedOn = (
                                await axios.post(
                                  `${UNIT_PATH}/electorate/${cookie.electorate.id}/request-approval`,
                                  {},
                                  {
                                    headers: {
                                      authorization: `Bearer ${cookie.jwtToken}`,
                                    },
                                    role: ROLE.ELECTORATE.toLowerCase(),
                                  }
                                )
                              ).data;
                              const _cookie = {
                                ...cookie,
                                electorate: {
                                  ...cookie.electorate,
                                  requestedOn,
                                },
                              };
                              setCookieStore(_cookie);
                              closeDialog(() =>
                                setSnackMsg("Request approved successfully")
                              );
                            } catch (err) {
                              setSnackMsg(err.response?.data || err.message);
                            }
                          }}
                          autoFocus
                        >
                          Agree
                        </Button>
                      </>
                    ),
                    styles: {
                      paper: {
                        height: "auto",
                      },
                    },
                  })
                }
                disabled={electorate.requestedOn}
              >
                request approval
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

function Electorate(props) {
  const [electorate, setElectorate] = useState({});
  const [displayFlow, setDisplayFlow] = useState(false);
  const [executiveData, setExecutiveData] = useState(null);
  const [nomineeData, setNomineeData] = useState(null);
  const [categoryFilterOpt, setCategoryFilterOpt] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [executives, setExecutives] = useState([]);
  const formTab = searchParams.get("formTab");
  const { socket, cookie, setSnackMsg, setDialogProps, closeDialog } =
    useContext();
  const navigate = useNavigate();
  let stateRef = useRef({});
  stateRef = stateRef.current;
  // learn
  useEffect(() => {
    socket.disconnected && socket.connect();
    socket.on("electorate-update", (elec, reason) => {
      console.log(
        "electorate update in parent..",
        elec.id === cookie.electorate.id,
        reason
      );
      if (elec.id === cookie.electorate.id) {
        if (reason === "request-approval") setNomineeData({});
        else if (reason === "revoke-approval") setNomineeData(null);
        setElectorate(elec);
      }
    });
    socket.on("disconnect-user", (role) => {
      if (role === ROLE.ELECTORATE) {
        logout(true);
        navigate("/");
      }
    });
    if (formTab === "executive") setDisplayFlow(true);
    else setDisplayFlow(false);
    return () => handleCancelRequest();
  }, [socket, cookie, formTab, navigate]);
  useEffect(() => {
    (async () => {
      if (!stateRef.hasInit) {
        stateRef.hasInit = true;
        setExecutives(await getExecutives());
        setElectorate(await getElectorate(cookie.electorate.id));
        setLoading(false);
      }
    })();
  }, [cookie]);
  if (!cookie) return <Redirect />;
  else if (loading) return <CircularProgress />;

  const handleFormData = async (data, person, action) => {
    console.log(data.name, person);
    setSearchParams({
      formTab: person,
    });
    if (person === "executive") {
      if (action === "edit") setExecutiveData(data);
      else if (action === "response") setExecutiveData(null);
    } else if (person === "nominee") {
      if (action === "edit") {
        setCategoryFilterOpt({
          ...categoryFilterOpt,
          open: false,
        });
        setNomineeData(data);
      } else if (action === "response") setNomineeData(null);
    }
  };
  const header = electorate.requestedOn ? null : (
    <Stack alignItems="flex-end">
      {displayFlow ? (
        <Typography
          variant="h4"
          component="span"
          sx={{
            mt: 1,
            mb: 2,
            cursor: "pointer",
            border: "1px solid pink",
          }}
          onClick={() => setDisplayFlow(false)}
        >
          Add nominee
        </Typography>
      ) : (
        <Typography
          variant="h4"
          component="span"
          sx={{
            cursor: "pointer",
            border: "1px solid pink",
            mt: 1,
            mb: 2,
          }}
          onClick={() => setDisplayFlow(true)}
        >
          Add executive
        </Typography>
      )}
    </Stack>
  );

  return (
    <>
      <Header
        cookie={cookie}
        setCategoryFilterOpt={(opt) => setCategoryFilterOpt(opt)}
        hideExecutivesLink={!executives.length}
      />
      <Box sx={{ mt: "100px" }}>
        <Grid container component="section">
          <Grid item xs={12}>
            <Typography variant="h2" color="primary.main" component="h4">
              {cookie.electorate.name}{" "}
              {JSON.stringify(cookie.electorate.chairperson)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ p: 1 }}>
            <ApprovalMonitor electorate={electorate} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ p: 1 }}>
            {!electorate.chairperson && electorate.approvedOn ? (
              <Stack
                elevation={12}
                sx={{
                  ..._styles.paper,
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" align="center" color="primary.main">
                  Nominees and executive data has been approved
                </Typography>
              </Stack>
            ) : (
              <DrawerSlide
                displayFlow={electorate.requestedOn ? false : displayFlow}
                displayElement={
                  <AddNominee
                    header={header}
                    formData={nomineeData}
                    onFormData={handleFormData}
                  />
                }
                flowElement={
                  <AddExecutive
                    header={header}
                    formData={executiveData}
                    onFormData={handleFormData}
                  />
                }
              />
            )}
          </Grid>
        </Grid>
        <Box component="section">
          <Executives
            executives={executives}
            editorMode
            onFormData={handleFormData}
          />
        </Box>
      </Box>
      <CategoryFilter
        {...categoryFilterOpt}
        editorMode
        onClose={() =>
          setCategoryFilterOpt({
            ...categoryFilterOpt,
            open: false,
          })
        }
        setDialogProps={setDialogProps}
        setSnackMsg={setSnackMsg}
        closeDialog={closeDialog}
        onFormData={handleFormData}
        cookie={cookie}
      />
    </>
  );
}

Electorate.propTypes = {};

const _styles = {
  appBar: {
    link: {
      color: "#fff",
      border: "1px solid #fff",
      borderRadius: 5,
      minWidth: "100px",
      textAlign: "center",
      mx: 1,
      textDecoration: "none",
      cursor: "pointer",
      transition: "all .4s ease-in-out",
      display: {
        xs: "none",
        s480: "inline-block",
      },

      p: 1,
      "&:hover": {
        color: "#213244",
        // borderColor: "#213244",
      },
      // boxShadow: 2,
      // backgroundColor: "#1976d2",
    },
  },
  paper: {
    p: 1,
    borderRadius: 5,
    maxWidth: "400px",
    backgroundColor: "#fff",
    boxShadow: 12,
    mx: "auto",
    my: 1,
    height: "100vh",
    maxHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  submitBtn: {
    borderRadius: 12,
    my: 2,
    p: 2,
  },
};

export default Electorate;
