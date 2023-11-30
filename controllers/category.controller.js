const { Categories, Images } = require("../models");
const { imageKit } = require("../utils");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, image } = req.body;

      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });

      // Simpan data image ke tabel images
      const createdImage = await Images.create({
        data: {
          url: uploadFile.url,
          title: req.file.originalname,
          metadata: {
            size: req.file.size,
            type: req.file.mimetype,
          },
        },
      });

      // Simpan data kategori baru ke tabel categories
      const category = await Categories.create({
        data: {
          name,
          imageId: createdImage.id, // ID gambar dari tabel images
        },
      });

      return res.status(201).json({
        category: category,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Categories.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!category) {
        return res.status(404).json({
          error: "Category not found!",
        });
      }

      return res.status(200).json({ category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  showAllCategory: async (req, res) => {
    try {
      const category = await Categories.findMany();

      if (Categories.length === 0) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }

      return res.status(200).json({ category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, image } = req.body;

      // Mengecek apakah kategori tersedia
      const findCategory = await Categories.findUnique({
        where: { id },
      });

      if (!findCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }

      // Variabel untuk menyimpan hasil upload file jika ada
      let uploadFile;

      // Mengecek apakah ada file yang diunggah
      if (req.file) {
        const fileToString = req.file.buffer.toString("base64");

        uploadFile = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileToString,
        });

        // Simpan data image ke tabel images
        const createdImage = await Images.create({
          data: {
            url: uploadFile.url,
            title: req.file.originalname,
            metadata: {
              size: req.file.size,
              type: req.file.mimetype,
            },
          },
        });

        // Menghapus gambar lama jika ada
        if (findCategory.imageId) {
          await Images.delete({
            where: { id: findCategory.imageId },
          });
        }

        // Mengupdate kategori dengan perubahan nama dan ID gambar baru
        const updatedCategory = await Categories.update({
          where: { id },
          data: {
            name,
            imageId: createdImage.id,
          },
        });

        return res.status(200).json({
          message: "Category updated successfully",
          category: updatedCategory,
        });
      } else {
        // Jika tidak ada file yang diunggah, hanya mengupdate nama kategori
        const updatedCategory = await Categories.update({
          where: { id },
          data: { name },
        });

        return res.status(200).json({
          message: "Category updated successfully",
          category: updatedCategory,
        });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const id = req.params.id;

      const findCategory = await Categories.findUnique({
        where: {
          id: id,
        },
        include: {
          image: true,
        },
      });

      if (!findCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }

      // Menghapus data gambar dari tabel "images"
      if (findCategory.image) {
        const deleteImage = await Images.delete({
          where: {
            id: findCategory.image.id,
          },
        });
      }

      const category = await Categories.delete({
        where: {
          id: id,
        },
      });

      return res.status(204).json({
        message: "Delete successfully",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
