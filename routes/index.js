const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./category"),
  courseRouter = require("./course"),
  chapterRouter = require("./chapter"),
  materialRouter = require("./material"),
  filterRouter = require("./filter"),
  userRouter = require("./user"),
  transactionRouter = require("./transaction");

router.use("/category", categoryRouter);
router.use("/course", courseRouter);
router.use("/chapter", chapterRouter);
router.use("/material", materialRouter);
router.use("/filter", filterRouter);
router.use("/user", userRouter);
router.use("/transaction", transactionRouter);

module.exports = router;
