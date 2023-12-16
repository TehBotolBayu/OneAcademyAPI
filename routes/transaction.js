const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/transaction.controller"),
  middleware = require("../middlewares/auth");

// localhost:3000/api/v1/courseId/buy
// Masukkan Token Bearer Login
router.post("/:id/buy", middleware.checkToken, controller.buyCourse);
router.get("/:id/detailTransaction",middleware.checkToken,controller.getTransaction);
router.post("/:id/pay", middleware.checkToken, controller.payTransaction);
router.get("/", controller.getAllTransaction);

// for debugging
router.delete("/deleteAll", controller.deleteTransaction);

module.exports = router;
