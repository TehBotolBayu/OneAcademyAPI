const { Materials } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      if(res.locals.roleId !== 1){
        return res.status(401).json({
          error: "Unauthorized"
        })
      }
      const material = await Materials.create({
        data: {
          step: parseInt(req.body.step),
          title: req.body.title,
          videoURL: req.body.videoURL,
          duration: parseInt(req.body.duration),
          course: {
            connect: {id: req.body.courseId}
          },
          chapter: {
            connect: { id: req.body.chapterId },
          },
        },
      });
      return res.status(201).json({
        material,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error : "Something went wrong" });
    }
  },

  getAllMaterial: async (req, res) => {
    try {
      const materials = await Materials.findMany({
        take: 10,
        include : {
          chapter : true
        },
        orderBy : {
          step : 'asc'
        }
      });

      return res.status(201).json({
        materials,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error : "Something went wrong" });
    }
  },

  update: async (req, res) => {
    try {
      if(res.locals.roleId !== 1){
        return res.status(401).json({
          error: "Unauthorized"
        })
      }
      const material = await Materials.update({
        data: {
          step: req.body.step,
          title: req.body.title,
          videoURL: req.body.videoURL,
          duration: req.body.duration,
        },
        where : {
            id : req.params.id
        }
      });
      return res.status(201).json({
        message : "Material was Updated",
        material
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error : "Something went wrong" });
    }
  },

  destroy: async (req, res) => {
    try {
      if(res.locals.roleId !== 1){
        return res.status(401).json({
          error: "Unauthorized"
        })
      }
      const material = await Materials.delete({
        where: {
          id: req.params.id,
        },
      });
      return res.status(204).json({
        message: "Delete successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error : "Something went wrong" });
    }
  },
};
