import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { LoadingBall } from "./Animation";
import axios from "../api/axios";
import { useContext } from "../provider";

function Notification({ anchorEl = null, open = false, endpoint }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useContext();
  if (socket.disconnected) socket.connect();
  useEffect(() => {
    socket.on("new-notifications", (notifi) => updateNotifications(notifi));
  }, []);
  useEffect(() => {
    (async () => {
      try {
        if (endpoint) {
          updateNotifications((await axios.get(endpoint)).data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err?.response.data || err.message);
      }
    })();
  }, [endpoint]);
  const updateNotifications = (notifis) => {
    setNotifications((prev) => prev.concat(notifis));
  };
  return (
    <>
      <Popover anchorEl={anchorEl} open={open}>
        <Paper>
          {loading ? (
            <LoadingBall />
          ) : (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <>
                {notifications.map((n, i) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Travis Howard"
                          src="/static/images/avatar/2.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Summer BBQ"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              to Scott, Alex, Jennifer
                            </Typography>
                            {" — Wish I could come, but I'm out of town this…"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))}
              </>
            </List>
          )}
        </Paper>
      </Popover>
    </>
  );
}

Notification.propTypes = {};

export default Notification;
