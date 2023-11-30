const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./category"),
  courseRouter = require("./course");

router.use("/category", categoryRouter);
router.use("/course", courseRouter);

module.exports = router;
