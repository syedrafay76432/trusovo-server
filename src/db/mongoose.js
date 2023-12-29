const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("OK");
  })
  .catch((error) => {
    console.log("error" + error);
  });
