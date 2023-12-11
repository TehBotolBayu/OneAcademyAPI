const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/transaction.controller"),
  middleware = require("../middlewares/auth");

router.post("/:id/buy", middleware.checkToken, controller.buyCourse);
// localhost:3000/api/v1/ID course/buy
// Masukkan Token Bearer Login

<<<<<<< HEAD
router.get(
  "/:id/detailTransaction",
  middleware.checkToken,
  controller.getTransaction
);
=======
router.post('/:id/buy', middleware.checkToken, controller.buyCourse);
router.get('/:id/detailTransaction', middleware.checkToken, controller.getTransaction);
router.post('/:id/pay', middleware.checkToken, controller.payTransaction);
router.get('/', controller.getAllTransaction);
>>>>>>> eb6dc37dbd62882bdde1412003314deed7ea3c15

router.post("/:id/pay", middleware.checkToken, controller.payTransaction);

module.exports = router;
