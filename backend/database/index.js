const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connectionInstance = await mongoose.connect(
      process.env.DB_CONNTECTION_STRING
    );
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
