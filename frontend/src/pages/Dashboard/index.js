import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { getCookie, getCookieStore } from "../../helpers";
import Redirect from "../../components/Redirect";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Provider } from "../../provider";
import Electorate from "./Electorate";
import { IconButton, Snackbar } from "@mui/material";
import { ROLE } from "../../config";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "../../components/Animation";
import { createRedirectURL } from "../../api/helpers";
import { SlideLeft } from "../../components/Animation";
import Dialog from "../../components/Dialog";
function Dashboard(props) {
  const [cookie, setCookie] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackBar, setSnackBar] = useState({});
  const [dialogProps, _setDialogProps] = useState({});
  let { pathname, state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const cookie = (await getCookieStore())[getCookie()];
      if (!cookie) navigate(createRedirectURL("no-redirect", ""));
      else {
        let match = /^\/me\/dashboard\/?$/i.test(pathname);
        if (match) {
          if (cookie.role === ROLE.VOTER) navigate("/");
          else if (!cookie.isLogin) navigate(createRedirectURL("", ""));
          else {
            navigate(`/me/dashboard/${cookie.role.toLowerCase()}`);
            setCookie(cookie);
            setLoading(false);
          }
        } else if (!cookie.isLogin) navigate(createRedirectURL("", ""));
        else {
          setCookie(cookie);
          setLoading(false);
        }
      }
    })();
  }, [pathname, navigate, state]);
  const pages = [
    {
      path: "/electorate",
      element: <Electorate />,
    },
  ];
  const setDialogProps = (props) => {
    _setDialogProps({
      ...props,
      open: true,
    });
  };
  const closeDialog = (onUnMount) => {
    _setDialogProps((prev) => ({
      ...prev,
      open: false,
      onUnMount,
    }));
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

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <Provider
        context={{
          cookie: cookie,
          setSnackMsg,
          closeDialog,
          setDialogProps,
        }}
      >
        <Routes>
          {pages.map((page, i) => (
            <Route element={page.element} path={page.path} key={i} />
          ))}
          <Route
            element={<Redirect to={createRedirectURL("", "")} />}
            path="*"
          />
        </Routes>
      </Provider>
      <Dialog {...dialogProps} />
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

Dashboard.propTypes = {};

export default Dashboard;
