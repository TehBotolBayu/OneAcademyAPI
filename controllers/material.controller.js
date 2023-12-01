const { Materials } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const material = await Materials.create({
        data: {
          step: req.body.step,
          title: req.body.title,
          videoURL: req.body.videoURL,
          duration: req.body.duration,
          status: req.body.status,
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
      return res.status(400).json({ error: error.message });
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
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const material = await Materials.update({
        data: {
          step: req.body.step,
          title: req.body.title,
          videoURL: req.body.videoURL,
          duration: req.body.duration,
          status: req.body.status,
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
      return res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
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
      return res.status(400).json({ error: error.message });
    }
  },
};
