require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "https://food-finder-frontend-o585zdhl3-ayush7aryals-projects.vercel.app/",
    ]
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use("/user", require("./routes/userRouter"));
app.use("/restaurant", require("./routes/restaurantRouter"));
app.use("/api", require("./routes/upload"));
app.use("/admin", require("./routes/adminRouter"))

const URI = process.env.MONGODB_URI;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

app.get("/", (req, res) => {
  res.json({ msg: "Dashboard!" });
});

app.listen(3000, () => {
  console.log("Running on server 3000!");
});
