const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(
      "mongodb+srv://ahsan:password-123@cluster0.h3mh35m.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((data) => {
      console.log(`Db connected successfully with ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("db error", e);
    });
};

module.exports = database;
