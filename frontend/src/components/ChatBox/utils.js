export const recordAudio = () =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          resolve({
            audioBlob,
            audioUrl,
            play: async () => await play(audioUrl),
          });
        });
        mediaRecorder.stop();
      });

    const play = async (audioUrl) => {
      const audio = new Audio(audioUrl);
      audio.play();
    };
    const pause = () =>
      new Promise((resolve) => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.pause();
          mediaRecorder.addEventListener("pause", () => {});
        }
      });

    const resume = () =>
      new Promise((resolve) => {
        if (mediaRecorder.state === "paused") mediaRecorder.resume();
        resolve();
      });
    resolve({ start, stop, play, pause, resume });
  });
