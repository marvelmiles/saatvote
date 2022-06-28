import { Stopwatch } from "../../helpers";

export const recordAudio = ({
  track,
  timeout,
  onTimeout,
  onPlayEnd,
  HMSDisplay = 2,
  sep = ":",
}) =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
    let _audioUrl,
      _currentTime,
      _watch,
      _duration,
      _formatedCT,
      _formatedDuration,
      _currentTimeFrame,
      state = "";
    mediaRecorder.addEventListener("resume", function () {
      console.log("resuming...");
      state = "resuming";
    });
    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
      console.log("data", audioChunks.length);
    });

    const start = () => {
      state = "recording";
      if (mediaRecorder.state !== "recording") {
        mediaRecorder.start();
        if (track) {
          _watch = new Stopwatch(track, timeout, onTimeout);
          _watch.start();
        }
      } else console.log("recording already...");
    };
    let _audio;
    const stop = () =>
      new Promise((resolve) => {
        if (
          mediaRecorder.state === "inactive" ||
          mediaRecorder.satte === "paused"
        )
          return resolve();
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          _audioUrl = URL.createObjectURL(audioBlob);
          if (state === "resuming") {
            _audio.src = _audioUrl;
          } else {
            _audio = new Audio(_audioUrl);
          }
          if (_watch) _watch.pause();
          resolve({
            audioBlob,
            audioUrl: _audioUrl,
            audioChunks,
            play: async () => {
              _audio = await play(_audio, _audioUrl);
            },
            pause: () => pause(_audio),
          });
        });
        mediaRecorder.stop();
        state = "";
      });

    const play = (audio, url) =>
      new Promise((resolve) => {
        console.log("playing", audio.src);
        const getDuration = async (audio) => {
          const c = audio.currentTime;
          while (audio.duration === Infinity) {
            // it neccessary to just sleep the code and fake a big time
            // crazy hack to some browser
            await new Promise((r) => setTimeout(r, 50));
            audio.currentTime = 10000000 * Math.random();
            console.log("timer");
          }
          audio.currentTime = c;
          return audio.duration;
        };
        getDuration(audio).then((duration) => {
          audio.addEventListener("timeupdate", function () {
            _currentTime = Math.floor(this.currentTime);
            _duration = Math.floor(duration);
            _formatedCT = Stopwatch.toHHMMSS(_currentTime).stringify(
              HMSDisplay,
              sep
            );
            _formatedDuration = Stopwatch.toHHMMSS(_duration).stringify(
              HMSDisplay,
              sep
            );
            _currentTimeFrame = _formatedCT + " " + _formatedDuration;
            if (track && _watch) track.textContent = _currentTimeFrame;
            Stopwatch.toHHMMSS(_duration).stringify(HMSDisplay, sep);
            if (_currentTime === _duration) {
              if (track) track.textContent = "00:00";
              if (typeof onPlayEnd === "function")
                onPlayEnd({
                  currentTime: _currentTime,
                  currentDuration: _duration,
                  formatedDuration: _formatedDuration,
                  formatedCT: _formatedCT,
                });
            }
          });
          audio.play();
          resolve(audio);
        });
      });
    const resume = () =>
      new Promise((resolve) => {
        if (mediaRecorder.state === "recording") {
          state = "resuming";
          mediaRecorder.resume();
          console.log("resuiming...");
          resolve();
        } else {
          console.log("not reuming");
        }
      });

    const pause = (audio) =>
      new Promise((resolve) => {
        if (audio.played) {
          console.log("pausing...", audio.src);
          audio.pause();
          if (track) track.textContent = _currentTimeFrame;
          resolve(audio);
        } else console.log("not played...");
      });

    const reset = () => {
      console.log("offloading...");
      audioChunks = [];
      _audioUrl = "";
      state = "";
    };
    const destroy = () => {
      reset();
      if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
    };
    const getState = () => {
      return state;
    };
    resolve({ start, stop, resume, play, pause, reset, destroy, getState });
  });
