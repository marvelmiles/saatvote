import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function AudioPlayer(props) {
  return (
    <Box
      src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/zapsplat_multimedia_alert_chime_short_musical_notification_cute_child_like_001_64918.mp3?_=1"
      controls="true"
      sx={{
        "&::-webkit-media-controls-mute-button": {
          borderRadius: "50%",
        },
      }}
      component="audio"
    />
  );
}

AudioPlayer.propTypes = {};

export default AudioPlayer;
