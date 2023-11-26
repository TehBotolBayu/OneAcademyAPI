const express = require("express"),
    router = express.Router(),
    controller = require('../controllers/category.controller')
    multerLib = require('multer')();


router.post("/create",  multerLib.single('image'), controller.create);
router.put("/:id",multerLib.single('image'), controller.update);
router.get("/showAll", controller.showAllCategory);
router.get("/:id", controller.getCategoryById);
router.delete("/:id", controller.destroy);

module.exports = router