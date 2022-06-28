import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios, { handleCancelRequest } from "../../api/axios";
import { getCookie } from "../../helpers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Progress from "../Progress";

function Conversations({ styles, header = null, onClose, onClick = () => {} }) {
  const jwtToken = getCookie("jwtToken", {
    userAcc: localStorage.getItem("userAcc"),
  });
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const endpoint = localStorage.getItem("user");
    const getConvss = async () => {
      try {
        const { data: d } = await axios.get(`/${endpoint}/conversations`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        console.log(d.length);
        setConversations(d);
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };
    endpoint && getConvss();
    return () => {
      handleCancelRequest(`/${endpoint}/conversations`);
    };
  }, [jwtToken]);

  return (
    <>
      {loading ? (
        <Progress />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            borderRadius: "inherit",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              backgroundColor: "primary.main",
              width: "calc(100% - 16px)",
              zIndex: "tooltip",
              borderTopLeftRadius: "inherit",
            }}
          >
            {header}
          </Box>
          <List sx={{ p: 0, mt: 4 }}>
            {conversations.map((conv, i) => (
              <Box key={i} onClick={onClick.bind(this, conv)}>
                <ListItem alignItems="flex-start" sx={{ p: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.light"
                        >
                          {conv.name}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.light"
                        >
                          — I'll be in your neighborhood doing errands this…
                        </Typography>
                      </>
                    }
                    secondary={
                      <Typography color="primary.light">{conv.role||"backer"}</Typography>
                    }
                  />
                </ListItem>
                {conversations.length - 1 !== i && (
                  <Divider variant="middle" component="hr" />
                )}
              </Box>
            ))}
          </List>
        </Box>
      )}
    </>
  );
}

Conversations.propTypes = {};

export default Conversations;
