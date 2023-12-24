const { Chapters } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      if(res.locals.roleId !== 1){
        return res.status(401).json({
          error: "Unauthorized"
        })
      }
      const chapter = await Chapters.create({
        data: {
          totalDuration: parseInt(req.body.totalDuration),
          step: parseInt(req.body.step),
          title: req.body.title,
          course: {
            connect: { id: req.body.courseId },
          },
        },
      });
      return res.status(201).json({
        chapter,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error : "Something went wrong" });
    }
  },

  getAllChapter: async (req, res) => {
    try {
      const chapters = await Chapters.findMany({
        take: 10,
        include: {
          course: true,
        },
        orderBy: {
          step: "asc",
        },
      });

      return res.status(201).json({
        chapters,
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
      const chapter = await Chapters.update({
        data: {
          totalDuration: req.body.totalDuration,
          step: req.body.step,
          title: req.body.title,
        },
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        message: "Chapter was Updated",
        chapter,
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
      const chapter = await Chapters.delete({
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