import React, { useCallback, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Delete from "@mui/icons-material/Delete";
import Wave from "./components/Wave";
import Stop from "@mui/icons-material/Stop";
import { recordAudio } from "./utils";
import { Mic, Pause, PlayArrow } from "@mui/icons-material";

const AudioRecorder = ({
  autoRecord = true,
  forceStop = false,
  onError = () => {},
  onStop = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const audio = useRef();
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const recorder = await recordAudio();
  //       if (autoRecord) {
  //         // await recorder.start();
  //         try {
  //           // audio.current = new Audio(
  //           //   "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3"
  //           // );
  //           // console.log(audio.current);
  //           setRecording(true);
  //         } catch (err) {
  //           console.log(err.message, "erio");
  //         }
  //         console.log("recorderr availavble");
  //       }
  //       setRecorder(recorder);
  //     } catch (err) {
  //       // onError(err);
  //       console.log("error while creating recorder Instacne");
  //     }
  //   })();
  // }, [autoRecord]);

  const stopRecorder = useCallback(
    async (triggerEvent = false, forceStop = false) => {
      try {
        if (triggerEvent) {
          return onStop({
            ...(await recorder.stop()),
            forceStop,
          });
        }
        return await recorder.stop();
      } catch (err) {
        onError(err);
        console.log("error while stoping", err.message);
      }
    },
    [recorder, onError, onStop]
  );

  // useEffect(() => {
  //   forceStop && stopRecorder(true, true);
  // }, [forceStop, stopRecorder]);

  return (
    <>
      <button
        onClick={() => {
          console.log(audio.current);
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          audio.current.pause();
        }}
      >
        Pause
      </button>
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
        <IconButton
          variant="icon"
          sx={{ border: "1px solid red", flex: "0 0 auto" }}
        >
          <Delete />
        </IconButton>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ mr: 1, width: "100%", overflow: "hidden" }}
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
                onClick={() => setIsPlaying(false)}
              >
                <Pause />
              </IconButton>
            ) : (
              <IconButton
                disabled={recording ? !isPlaying : false}
                variant="icon"
                onClick={async () => {
                  try {
                    setIsPlaying(true);
                    await recorder.play();
                  } catch (err) {
                    onError(err);
                    console.log("err while playing");
                  }
                }}
              >
                <PlayArrow />
              </IconButton>
            )}
            {recording ? (
              <IconButton
                disabled={!recording}
                onClick={stopRecorder}
                variant="icon"
                sx={{ mx: 1 }}
              >
                <Stop />
              </IconButton>
            ) : (
              <IconButton
                disabled={recording || isPlaying}
                onClick={() => setRecording(true)}
                variant="icon"
                sx={{ mx: 1 }}
              >
                <Mic />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default AudioRecorder;
