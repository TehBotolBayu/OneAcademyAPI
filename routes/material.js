const express = require("express"),
  router = express.Router(),
  materialController = require("../controllers/material.controller"),
  {checkToken} = require('../middlewares/auth');


router.post("/create", checkToken, materialController.create);
router.get("/", materialController.getAllMaterial);
router.put("/:id", checkToken, materialController.update);
router.delete("/:id", checkToken, materialController.destroy);
// router.get("/:courseId", courseController.getCourseById);




module.exports = router;