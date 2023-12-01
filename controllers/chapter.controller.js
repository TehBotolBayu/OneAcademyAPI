const { Chapters } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const chapter = await Chapters.create({
        data: {
          totalDuration: req.body.totalDuration,
          step: req.body.step,
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
      return res.status(400).json({ error: error.message });
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
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
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
      return res.status(201).json({
        message: "Chapter was Updated",
        chapter,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
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
      return res.status(400).json({ error: error.message });
    }
  },
};
