import React, { useCallback, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Delete from "@mui/icons-material/Delete";
import Wave from "./components/Wave";
import Stop from "@mui/icons-material/Stop";
import { recordAudio } from "./utils";
import { Mic, Pause, PlayArrow } from "@mui/icons-material";
import { Typography } from "@mui/material";

function AudioRecorder(props) {
  const propsRef = useRef(props);
  const {
    onError = () => {},
    onStop = () => {},
    autoRecord = true,
  } = propsRef.current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const audioRef = useRef();
  const audio = audioRef.current;
  const stopRecorder = useCallback(
    async (triggerEvent = false, forceStop) => {
      try {
        if (triggerEvent) {
          console.log("prepering force stop...");
          let data = await recorder.stop();
          data = data || audio;
          if (data.audioUrl);
          return onStop({
            ...data,
            forceStop,
          });
        }
        audioRef.current = await recorder.stop();
        setRecording(false);
        console.log("stopped recording...");
      } catch (err) {
        onError(err);
        console.log("error while stoping", err.message);
      }
    },
    [recorder, onStop, onError]
  );
  const trackRef = useRef();
  useEffect(() => {
    (async () => {
      if (!recorder) {
        try {
          const recorder = await recordAudio({
            track: trackRef.current,
            timeout: 1,
            onTimeout: async function () {
              audioRef.current = await recorder.stop();
              setRecording(false);
            },
            onPlayEnd: () => {
              setIsPlaying(false);
            },
          });
          if (autoRecord) {
            await recorder.start();
            setRecording(true);
            console.log("recording auto...");
          }
          setRecorder(recorder);
        } catch (err) {
          // onError(err);
          console.log("error while creating recorder Instacne");
        }
      }
    })();
    return () => {
      audioRef.current = null;
      recorder?.destroy();
    };
  }, [autoRecord, recorder]);

  useEffect(() => {
    props.forceStop && stopRecorder(true, true);
  }, [props.forceStop, stopRecorder]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          minWidth: 0,
          width: "100%",
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          pb: 1,
          border: "1px solid yellow",
        }}
      >
        <Stack
          sx={{
            p: 1,
            maxWidth: "60px",
            minWidth: 0,
          }}
        >
          {props.actionElement || null}
          <Typography
            variant=""
            sx={{ mt: 1 }}
            ref={trackRef}
            style={{ color: "#fff" }}
          >
            00:00
          </Typography>
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            mr: 1,
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Wave
            styles={{
              container: {
                height: "35px",
              },
            }}
            pause={!recording ? !isPlaying : false}
          />
          <Box sx={{ mt: 1, display: "flex", flexWrap: "nowrap" }}>
            {isPlaying ? (
              <IconButton
                disabled={!isPlaying}
                variant="icon"
                onClick={async () => {
                  try {
                    await audio.pause();
                    setIsPlaying(false);
                    console.log("audio paused");
                  } catch (err) {
                    onError(err);
                    console.log("err while pausing..");
                  }
                }}
              >
                <Pause />
              </IconButton>
            ) : (
              <IconButton
                disabled={recording ? !isPlaying : false}
                variant="icon"
                onClick={async () => {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                    console.log("playing audio");
                  } catch (err) {
                    onError(err);
                    console.log("err while playing");
                  }
                }}
              >
                <PlayArrow />
              </IconButton>
            )}
            <IconButton
              disabled={!recording}
              onClick={stopRecorder.bind(this, false, false)}
              variant="icon"
              sx={{ mx: 1 }}
            >
              <Stop />
            </IconButton>
            {/* {recording ? (
              <IconButton
                disabled={!recording}
                onClick={stopRecorder.bind(this, false, false)}
                variant="icon"
                sx={{ mx: 1 }}
              >
                <Stop />
              </IconButton>
            ) : (
              <IconButton
                disabled={recording || isPlaying}
                onClick={async () => {
                  try {
                    await recorder.resume();
                    setRecording(true);
                    console.log("resuming recorder...");
                  } catch (err) {
                    onError(err);
                    console.log("err while resuming");
                  }
                }}
                variant="icon"
                sx={{ mx: 1 }}
              >
                <Mic />
              </IconButton>
            )} */}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default AudioRecorder;
