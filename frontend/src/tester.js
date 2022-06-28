const axios = require("axios");

const myRequest = async () => {
  try {
    const retries = 3; // amount of retries we're willing to do
    const myConfig = {
      headers: {
        Authorization: "Basic lorem12345",
      },
      // we're willing to wait 50ms, servers still hate you
      timeout: 50,
    };
    for (var i = 0; i < retries; i++) {
      try {
        const req = await axios.get("https://mock.codes/200", myConfig);
        if (req) {
          console.log(req.data);
          break;
        } else {
          console.log("cannot fetch data");
        }
      } catch (error) {
        console.log("cannot fetch data");
      }
    }
  } catch (e) {
    console.log(e);
  }

  myRequest();
};
