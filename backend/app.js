const express = require("express");
const router = require("./routes/index");
const dbConnect = require("./database/index");
const errorHandler = require("./middlewares/errorhandling");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"],
};

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use(cors(corsOptions));

app.use(router);

app.use("/storage", express.static("storage"));

app.use(errorHandler);

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 4000, console.log(`server is running at port:${process.env.PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
