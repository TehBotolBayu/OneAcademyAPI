const express = require("express");
const router = express.Router();
const myClassController = require("../controllers/myClass.controller");
const { checkToken } = require("../middlewares/auth");

//getting user course progress status
router.get("/my-classes", checkToken, myClassController.getUserClasses);
router.get("/progress/course/:courseId", checkToken, myClassController.getProgressByCourse);
router.get("/progress/material/:materialId", checkToken, myClassController.getProgress)
router.get('/progress/user', checkToken, myClassController.getProgressbyUserId);

//setting user course progress
// contoh req json
// {
//     isCompleted: true
// }
router.put("/progress/complete/:materialId", checkToken, myClassController.setCompleted);

// localhost:3000/api/v1/myClass/my-classes

// for debugging purpose
// router.delete('/del', myClassController.deleteProgress);
// router.get('/getAll', myClassController.getAllProgress)

module.exports = router;
