const express = require('express'),
router = express.Router(),
courseController = require('../controllers/course.controller'),
imageController = require('../controllers/image.controller'),
multerLib = require('multer')();

router.post('/create', imageController.create, courseController.create)
router.put('/update', imageController.updateImage, courseController.updateCourse)
router.get('/', courseController.getAllCourses)
router.get('/courseId', courseController.getCourseById)
router.delete('/delete/courseId', courseController.deleteCourse)