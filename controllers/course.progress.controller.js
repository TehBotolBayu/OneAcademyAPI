const { Course_Progress } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


module.exports = {
    getProgress: async (req, res) => {
        try {            
            const progress = await Course_Progress.findUnique({
                where: {
                    userId: req.body.userId,
                    materialId: req.body.materialId
                }
            })
    
            return res.status(201).json({
                progress
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: error.message
            })
        }
    },

    getProgressByCourse: async (req, res) => {
        try {
            const progress = await Course_Progress.findMany({
                where: {
                    userId: req.body.userId,
                    courseId: req.body.courseId
                }
            })    
            return res.status(201).json({
                progress
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: error.message
            })
        }
    },

    
}