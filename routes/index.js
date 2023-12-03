const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./category"),
  courseRouter = require("./course"),
  chapterRouter = require("./chapter"),
  materialRouter = require("./material"),
  filterRouter = require("./filter");

router.use("/category", categoryRouter);
router.use("/course", courseRouter);
router.use("/chapter", chapterRouter);
router.use("/material", materialRouter);
router.use("/filter", filterRouter);

module.exports = router;
