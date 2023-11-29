const { Courses, Images } = require("../models");
const { imageKit } = require("../utils");

module.exports = {
    create: async (req, res) =>{
        try {
            const course = Courses.create({
                data: {
                    title : req.body.title,
                    instructor : req.body.instructor,
                    courseType : req.body.courseType,
                    level : req.body.level,
                    price : req.body.price,
                    description : req.body.description, 
                    imageId : res.locals.image,
                    categoryId : req.body.categoryId,
                }
            });

            res.status(200).json({
                course
            })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getAllCourses: async (req, res) =>{
        try {
            const courses = Courses.findMany()

            res.status(200).json({
                courses
            })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }       
    },
    getCourseById: async (req, res) =>{
        try {
            const course = Courses.findUnique({
                where: {
                    id: req.params.courseId
                }
            })

            res.status(200).json({
                course
            })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateCourse: async (req, res) =>{
        try {
            // if(!req.locals.image){
            //     req.locals.image = undefined 
            // }
            const course = Courses.update({
                data: {
                    title : req.body.title,
                    instructor : req.body.instructor,
                    courseType : req.body.courseType,
                    level : req.body.level,
                    price : req.body.price,
                    description : req.body.description, 
                    imageId : res.locals.image,
                    categoryId : req.body.categoryId,
                },
                where: {
                    id: req.params.courseId
                }
            })
            res.status(200).json({
                course
            })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    deleteCourse: async (req, res, next) =>{
        try {

            const course = Courses.delete({
                where: {
                    id: req.params.courseId
                }
            })

            const image = Images.findUnique({
                where:{
                    id: course.imageId
                }
            })
            
            res.locals.image = image;
            next();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
}