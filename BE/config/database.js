const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(
      "mongodb+srv://ArtisanA:V5RxLkiTEdKMRjoP@cluster0.kk7xmfe.mongodb.net/academy"
    )
    .then((data) => {
      console.log(`Db connected successfully with ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("db error", e);
    });
};

module.exports = database;
