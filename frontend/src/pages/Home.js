import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Person from "../components/Person";
import Carousel from "react-multi-carousel";
import Executives from "../components/Executives";
import Footer from "../components/Footer";
import Lead from "../components/Lead";
import { getPollUnit } from "../api/poll";
import { getExecutives } from "../api/user";
import { CircularProgress, SlideLeft } from "../components/Animation";
import { SubscriptionForm } from "../components/Forms";
import StatBox from "../components/StatBox";
import Countdown from "../components/Countdown";
import { handleCancelRequest } from "../api/axios";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { getCookie, getCookieStore } from "../helpers";
import { useContext } from "../provider";

function Home(props) {
  const { socket } = useContext();
  const [cookie, setCookie] = useState({});
  const [pollUnit, setPollUnit] = useState({});
  const [snackBar, setSnackBar] = useState({});
  const [categoryFilterOpt, setCategoryFilterOpt] = useState({});
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    socket.disconnected && socket.connect();
    socket.on("poll-update", (poll) => {
      console.log("poll updated............");
      setCategoryFilterOpt((prev) => ({
        ...prev,
        open: false,
      }));
      setPollUnit(poll);
    });
  }, [socket]);

  useEffect(() => {
    (async () => {
      setCookie((await getCookieStore())[getCookie()]);
      setPollUnit(await getPollUnit("status lastPoll lastRecord"));
      setExecutives(await getExecutives());
    })();
    return () => handleCancelRequest();
  }, []);

  const _renderUnitStatusInfo = () => {
    const pollDetails =
      pollUnit.lastPoll && pollUnit.lastRecord.stat ? (
        <Stack
          sx={{
            minHeight: "300px",
          }}
        >
          <Lead
            label={
              new Date(pollUnit.lastPoll).getFullYear() ===
              new Date().getFullYear()
                ? "Voting result"
                : `${new Date(pollUnit.lastPoll).getFullYear()} result`
            }
          />
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-around"
            alignItems="center"
            sx={{
              my: 2,
              flexGrow: 1,
            }}
          >
            <StatBox
              stat={pollUnit.lastRecord.stat.aggElectorates}
              label="Electorates"
            />
            <StatBox
              stat={pollUnit.lastRecord.stat.aggNominees}
              label="Nominees"
            />
            <StatBox stat={pollUnit.lastRecord.stat.aggVoters} label="Voters" />
            <StatBox stat={pollUnit.lastRecord.stat.aggVotes} label="Votes" />
            <StatBox
              stat={pollUnit.lastRecord.stat.aggExecutives}
              label="Executives"
            />
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Button
              sx={{
                minWidth: "auto",
              }}
            >
              More details
            </Button>
          </Stack>
        </Stack>
      ) : (
        <CircularProgress />
      );
    switch (pollUnit.status) {
      case "ongoing":
        return (
          <>
            <Lead label="Voting deadline" />
            <Countdown
              timeTillDate="6/26/2022 16:10"
              timeFormat="MM/D/yyyy hh:mm"
            />
          </>
        );
      case "concluded":
      case "await":
        return pollDetails;
      default:
        return <CircularProgress />;
    }
  };
  const winnersResponsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const setSnackMsg = (message, delay) => {
    setSnackBar({
      open: true,
      message,
      useCloseBtn: !delay,
      onClose: delay
        ? () =>
            setSnackBar((prev) => ({
              ...prev,
              open: false,
            }))
        : () => {},
    });
    delay &&
      setTimeout(() => {
        setSnackBar((prev) => ({
          ...prev,
          open: false,
        }));
      }, delay);
  };

  return (
    <>
      <Header
        pollStatus={pollUnit.status}
        hideExecutivesLink={!executives.length}
        setSnackMsg={setSnackMsg}
        cookie={cookie}
        setCategoryFilterOpt={setCategoryFilterOpt}
      />
      <Box
        component="main"
        sx={{
          mt: "61px",
        }}
      >
        <Grid
          container
          component="section"
          sx={{
            backgroundColor: "primary.main",
            borderBottomRightRadius: "400px",
            pt: 5,
            pb: 10,
          }}
        >
          <Grid item xs={12} sm={5}>
            <Stack
              justifyContent="center"
              sx={{
                width: "100%",
                maxWidth: "500px",
                height: "100%",
                px: 2,
                mx: "auto",
              }}
            >
              <Typography
                align="left"
                color="#fff"
                variant="h2"
                component="h2"
                disableUnderline
              >
                Your e-voting system for a fair result
              </Typography>
              <SubscriptionForm />
            </Stack>
          </Grid>
          <Grid xs={12} sm={7}>
            <Box
              sx={{
                maxWidth: "450px",
                minHeight: "300px",
                p: 1,
                boxShadow: 12,
                backgroundColor: "#fff",
                mx: "auto",
                borderRadius: 5,
              }}
            >
              {_renderUnitStatusInfo()}
            </Box>
          </Grid>
        </Grid>
        <Box component="section">
          {pollUnit.lastRecord && pollUnit.lastRecord.winners?.length ? (
            <Box>
              <Lead
                label={`${new Date(pollUnit.lastPoll).getFullYear()} winners`}
              />
              <Carousel responsive={winnersResponsive}>
                {pollUnit.lastRecord.winners.map((w, i) => (
                  <Person
                    key={i}
                    title1={w.name}
                    title2={w.category}
                    title3={w.gratitude}
                  />
                ))}
              </Carousel>
            </Box>
          ) : null}
          <Executives executives={executives} />
        </Box>
        <Footer />
      </Box>
      <CategoryFilter
        {...categoryFilterOpt}
        onClose={() =>
          setCategoryFilterOpt({
            ...categoryFilterOpt,
            open: false,
          })
        }
        setSnackMsg={setSnackMsg}
        cookie={cookie}
      />
      <Snackbar
        open={snackBar.open}
        message={snackBar.message}
        severity="info"
        action={
          snackBar.useCloseBtn && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackBar((prev) => ({ ...prev, open: false }))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
        TransitionComponent={SlideLeft}
        onClose={snackBar.onClose}
      />
    </>
  );
}

Home.propTypes = {};

export default Home;
