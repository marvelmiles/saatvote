import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import Carousel from "react-multi-carousel";
import Person from "./Person";
import { useContext } from "../provider";
import Lead from "./Lead";
import axios, { handleCancelRequest } from "../api/axios";
import { UNIT_PATH, ROLE } from "../config";

function Executives({ editorMode, executives = [], onFormData = () => {} }) {
  const [_executives, _setExecutives] = useState([]);
  const { socket, cookie, setSnackMsg, closeDialog, setDialogProps } =
    useContext();
  let stateRef = useRef({});
  stateRef = stateRef.current;
  useEffect(() => {
    socket.disconnected && socket.connect();
    socket.on("executive-update", (exec, action) => {
      console.log("new executive update... ", action);
      if (stateRef.eid !== exec.id || stateRef.action !== action) {
        if (action === "add") _setExecutives((prev) => prev.concat(exec));
        else if (action === "delete")
          _setExecutives((prev) => prev.filter((e) => e.id !== exec.id));
        stateRef.eid = exec.id;
        stateRef.action = action;
      }
    });
    _setExecutives(executives);
    return () => handleCancelRequest();
  }, [socket, executives]);
  const responsive = {
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
  let arr1 = _executives.slice(0, Math.ceil(_executives.length / 2));
  let arr2 = _executives.slice(arr1.length, _executives.length);
  const handleSelect = (type, ex) => {
    if (type === "delete") {
      setDialogProps({
        open: true,
        header: <Typography>Delete {ex.name}?</Typography>,
        content: <Box>Clicking ok will permanently delete {ex.name}.</Box>,
        footer: (
          <Box>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  const res = (
                    await axios.delete(`${UNIT_PATH}/executive/${ex.id}`, {
                      headers: {
                        authorization: `Bearer ${cookie.jwtToken}`,
                      },
                      role: ROLE.ELECTORATE,
                    })
                  ).data;
                  closeDialog(() => setSnackMsg(res, 5000));
                } catch (err) {
                  console.log(err.response?.data || err.message);
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
            maxWidth: "200px",
          },
        },
      });
    } else if (type === "edit") onFormData(ex, "executive", type);
  };
  return (
    <Box id="executives">
      {_executives.length ? (
        <>
          <Lead label="Executives" />
          <Box>
            <Carousel responsive={responsive}>
              {arr1.map((ex, i) => {
                return (
                  <Box key={i}>
                    <Person
                      title1={ex.name}
                      title2={ex.post}
                      title3={ex.department}
                      editorMode={editorMode}
                      onSelect={(type) => handleSelect(type, ex)}
                    />
                    {arr2[i] && (
                      <Person
                        title1={arr2[i].name}
                        title2={arr2[i].post}
                        title3={arr2[i].department}
                        editorMode={editorMode}
                        onSelect={(type) => handleSelect(type, ex)}
                      />
                    )}
                  </Box>
                );
              })}
            </Carousel>
          </Box>
        </>
      ) : null}
    </Box>
  );
}

Executives.propTypes = {};

export default Executives;
