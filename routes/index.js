const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./category"),
  courseRouter = require("./course"),
  chapterRouter = require("./chapter"),
  materialRouter = require("./material"),
  userRouter = require("./user"),
  transactionRouter = require("./transaction"),
  myClassRouter = require("./myClass");

router.use("/category", categoryRouter);
router.use("/course", courseRouter);
router.use("/chapter", chapterRouter);
router.use("/material", materialRouter);
router.use("/user", userRouter);
router.use("/transaction", transactionRouter);
router.use("/myClass", myClassRouter);

module.exports = router;
