import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Fade,
  IconButton,
  Link,
  List,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DarkMode,
  Groups,
  HowToVote,
  Login,
  Logout,
  Notifications,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { createRedirectURL } from "../api/helpers";
import { ROLE } from "../config";
import { logout } from "../api/user";

function Header({
  pollStatus = "",
  setSnackMsg,
  setCategoryFilterOpt,
  cookie = {},
  hideExecutivesLink = false, //
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = useRef();
  const isSm = useMediaQuery((theme) => theme.breakpoints.up("s480"));
  const links = [
    {
      element: (
        <Link href="#categories">
          <Button
            sx={{
              ..._styles.link,
              display: {
                xs: "none",
                s480: "block",
              },
            }}
            onClick={() =>
              setCategoryFilterOpt({
                open: true,
                useVoteBtn: false,
                personProps: {
                  editorMode: true,
                },
              })
            }
          >
            <Typography component="span">Categories</Typography>
          </Button>
        </Link>
      ),
    },
    {
      element: (!hideExecutivesLink || true) && (
        <Link
          href="#executives"
          sx={{
            display: {
              xs: "none",
              s320: "block",
            },
          }}
        >
          <IconButton variant="icon">
            <Groups />
          </IconButton>
        </Link>
      ),
    },
    {
      element:
        window.location.pathname !== "/" &&
        cookie.role === ROLE.ELECTORATE &&
        cookie.isLogin ? (
          <Link href="#notifications">
            <IconButton
              variant="icon"
              sx={{
                display: {
                  xs: "none",
                  s360: "block",
                },
              }}
            >
              <Notifications />
            </IconButton>
          </Link>
        ) : pollStatus === "ongoing" ? (
          <Link href="#vote">
            <IconButton
              variant="icon"
              sx={{
                display: {
                  xs: "none",
                  s360: "block",
                },
              }}
              onClick={() => {
                if (cookie?.role !== ROLE.VOTER) {
                  console.log("not a voter...");
                  setSnackMsg(
                    <Box>
                      <Typography component="span">
                        You have to
                        <Link href={createRedirectURL()}> login before </Link>
                        voting...
                      </Typography>
                    </Box>
                  );
                } else
                  setCategoryFilterOpt({
                    open: true,
                    useVoteBtn: true,
                    keepMounted: true,
                  });
              }}
            >
              <HowToVote />
            </IconButton>
          </Link>
        ) : null,
    },
    {
      element: (
        <IconButton
          variant="icon"
          sx={{
            display: {
              xs: "none",
              s280: "block",
            },
          }}
        >
          <DarkMode />
        </IconButton>
      ),
    },
    {
      element:
        pollStatus !== "concluded" ? (
          <Link
            href={createRedirectURL("no-redirect")}
            sx={{
              display: {
                xs: "none",
                s220: "block",
              },
            }}
          >
            <IconButton variant="icon">
              {cookie.isLogin ? <Logout /> : <Login />}
            </IconButton>
          </Link>
        ) : null,
    },
  ];

  useEffect(() => {
    if (pollStatus === "concluded") {
      (async () => {
        await logout(true);
      })();
    }
    !isSm && setAnchorEl(null);
  }, [pollStatus, isSm]);

  return (
    <>
      <AppBar elevation={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 1 }}
        >
          <Typography
            sx={{
              textDecoration: "none",
              color: "primary.light",
              transition: "all 0.223s",
              alignSelf: "center",
            }}
            variant="h4"
            noWrap
            component="a"
            href={window.location.pathname === "/" ? "#" : "/"}
          >
            SAATVOTE
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-around"
          >
            <Button
              sx={{
                color: "#fff",
              }}
              onClick={() => {
                setCategoryFilterOpt({
                  open: true,
                  useVoteBtn: true,
                  keepMounted: true,
                });
              }}
            >
              voter trier
            </Button>

            {links.map((link) => (
              <>{link.element}</>
            ))}
            <IconButton
              variant="icon"
              ref={anchorRef}
              sx={{
                display: isSm && !anchorEl ? "none" : "flex",
                color: "#fff !important",
                "&:hover,&:active": {
                  backgroundColor: "primary.main",
                },
              }}
              onClick={() => {
                console.log("toggle bar....");
                setAnchorEl(anchorEl ? null : anchorRef.current);
              }}
            >
              <MenuIcon
                sx={{
                  color: "#fff !important",
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </AppBar>

      <ClickAwayListener
        onClickAway={(e) => {
          if (!anchorRef.current.contains(e.target)) setAnchorEl(null);
        }}
      >
        <Popper
          open={Boolean(anchorEl)}
          placement="bottom"
          disablePortal={true}
          anchorEl={anchorEl}
          transition
          style={{
            zIndex: "1300",
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                sx={{
                  p: 0,
                  width: {
                    xs: "150px",
                    s300: "300px",
                  },
                  mx: 1,
                  borderRadius: "8px",
                }}
              >
                <List>
                  {links.map((link, i) => (
                    <ListItemText key={i}>
                      <Link
                        variant="h5"
                        // href={link.url}
                        sx={{
                          width: "90% !important",
                          backgroundColor: "#FAFAFA",
                          display: "inline-block",
                          p: 1,
                          borderTopRightRadius: 32,
                          borderBottomRightRadius: 32,
                          transition: "all 500ms ease-out",

                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "primary.main",
                          },
                        }}
                      >
                        {link.text}
                      </Link>
                    </ListItemText>
                  ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </>
  );
}

Header.propTypes = {};

const _styles = {
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
};

export default Header;
