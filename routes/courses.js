const express = require("express"),
  router = express.Router(),
  courseController = require("../controllers/course.controller"),
  imageController = require("../controllers/image.controller"),
  multerLib = require("multer")();

router.post("/create", multerLib.single('image'), imageController.create, courseController.create);
router.put(
  "/update",
  imageController.updateImage,
  courseController.updateCourse
);
router.get("/", courseController.getAllCourses);
router.get("/courseId", courseController.getCourseById);
router.delete("/delete/courseId", courseController.deleteCourse);

// SEARCH
router.get("/search/:query", courseController.search);
// localhost:3000/api/v1/course/search/modul

module.exports = router;
