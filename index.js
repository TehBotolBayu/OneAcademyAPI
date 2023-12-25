require("dotenv").config();

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 3000,
  cors = require("cors"),
  router = require("./routes");

app.use(express.json({ strict: false }));

app.use(cors());
app.use("/api/v1", router);

app.get("/api/docs", (req, res, next) => {
  try {
      res.redirect(
          "https://documenter.getpostman.com/view/24198059/2s9YkrbfXL"
      );
  } catch (error) {
      console.error(error);
      res.status(500).json({ error : "Something went wrong" });
  }
});

app.get("*", (req, res) => {
  return res.status(404).json({
    error: "End point is not registered",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
