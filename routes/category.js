const express = require("express"),
    router = express.Router(),
    controller = require('../controllers/category.controller'),
    multerLib = require('multer')(),
  {checkToken} = require('../middlewares/auth');

router.post("/create", checkToken,  multerLib.single('image'), controller.create);
router.put("/:id", checkToken, multerLib.single('image'), controller.update);
router.get("/", controller.showAllCategory);
router.get("/:id", controller.getCategoryById);
router.delete("/:id", checkToken, controller.destroy);

module.exports = router