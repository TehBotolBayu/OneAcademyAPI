const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./category"),
  coursesRouter = require("./course");

router.use("/category", categoryRouter);

router.use("/course", coursesRouter);

module.exports = router;
