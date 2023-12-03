const express = require("express"),
  router = express.Router(),
  materialController = require("../controllers/material.controller");


router.post("/create", materialController.create);
router.get("/", materialController.getAllMaterial);
router.put("/:id",materialController.update);
router.delete("/:id",  materialController.destroy);
// router.get("/:courseId", courseController.getCourseById);




module.exports = router;