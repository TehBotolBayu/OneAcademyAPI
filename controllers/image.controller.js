const { Images } = require("../models");
const {imageKit}  = require("../utils");

module.exports = {
    create: async (req, res, next) => {
        try {
            let stringFile = undefined;
            if(req.file) stringFile = req.file.buffer.toString('base64');

            if(stringFile){
                const uploadFile = await imageKit.upload({
                    fileName: Date.now() + '-' + req.file.originalname,
                    file: stringFile,
                })

                const image = await Images.create({
                    data: {
                        url: uploadFile.url,
                        title: req.file.originalname,
                        metadata: uploadFile
                    }
                })

                res.locals.data = image;
                next();
                return;
            }

            throw new Error("failed to upload image");
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })
        }
    },

    getImageById: async (req, res, next) => {
        try {
            const image = await Images.fundUnique({
                where: {
                    id: req.params.imageId
                }
            })

            res.locals.data = image;
            next();   
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })           
        }
    },

    updateImage: async (req, res) => {
        try {
            const course = res.locals.data;
            
            const imageId = course.imageId;

            const imageData = await Images.findUnique({
                where: {
                    id: imageId
                }
            })

            let stringFile = undefined;
            if(req.file) stringFile = req.file.buffer.toString('base64');

            if(stringFile){
                const deletedFile = await imageKit.deleteFile(imageData.metadata.fileId, (err, res) => {
                    if(err){
                        throw err;
                    }
                })

                const uploadFile = await imageKit.upload({
                    fileName: Date.now() + '-' + req.file.originalname,
                    file: stringFile
                })

                const image = await Images.update({
                    data: {
                        url: uploadFile.url,
                        title: req.file.originalname,
                        metadata: uploadFile
                    },
                    where: {
                        id: imageId
                    }
                })
                
                
            }

            return res.status(201).json({
              course
            });            
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })            
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const {data, image} = res.locals.data;
            // console.log(image);
            let deletedFile;
            if(image){
                deletedFile = await imageKit.deleteFile(image.metadata.fileId, (err, res) => {
                    if(err){
                        throw err;
                    }
                })
            }
            
            return res.status(400).json({
                status: "deleted",
                data: data,
                metadata: deletedFile
            })
        } catch (error) {
            return res.status(400).json({
                error
            })
        }
    }
}