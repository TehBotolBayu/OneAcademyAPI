const { Images } = require("../models");

module.exports = {
    create: async (req, res, next) => {
        try {
            let stringFile = undefined;
            if(req.file) stringFile = req.file.buffer.toString('base64');

            if(stringFile){
                const uploadFile = await imageApi.upload({
                    fileName: Date.now() + '-' + req.file.originalname,
                    file: stringFile
                })

                const image = await Images.create({
                    data: {
                        url: uploadFile.url,
                        title: req.file.originalname,
                        metadata: uploadFile
                    }
                })

                res.locals.image = image;
                next();
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

            res.locals.image = image;
            next();   
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })           
        }
    },

    updateImage: async (req, res, next) => {
        try {
            let stringFile = undefined;
            if(req.file) stringFile = req.file.buffer.toString('base64');

            if(stringFile){
                const uploadFile = await imageApi.upload({
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
                        id: req.params.imageId
                    }

                })
                
                res.locals.image = image;
                next();
            }

            next();
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })            
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const content = res.locals.image;

            const deletedFile = await imageApi.deleteFile(content.imageId, (err, res) => {
                if(err){
                    throw err;
                }
            })
            
            return res.status(400).json({
                status: "deleted",
                data: content,
                metadata: deletedFile
            })
        } catch (error) {
            return res.status(400).json({
                error
            })
        }
    }
}