const ImageKit = require("imagekit");

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

imageApi = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

module.exports = {
  imagekitUpload: async (req, res, next) => {
    try {
      let stringFile = undefined;
      if (req.file) stringFile = req.file.buffer.toString("base64");

      if (stringFile) {
        const uploadFile = await imageApi.upload({
          fileName: Date.now() + "-" + req.file.originalname,
          file: stringFile,
        });

        res.locals.data = uploadFile;
      }

      next();
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        error,
      });
    }
  },

  imagekitDelete: async (req, res, next) => {
    try {
      const content = res.locals.data;

      const deletedFile = await imageApi.deleteFile(
        content.imageId,
        (err, res) => {
          if (err) {
            throw err;
          }
        }
      );

      return res.status(400).json({
        status: "deleted",
        data: content,
        metadata: deletedFile,
      });
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  },

  imagekitGet: async (req, res) => {
    try {
      const content = res.locals.data;

      imageApi.getFileDetails(content.imageId, (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result);
        return res.json({
          data: content,
          metaData: result,
        });
      });
    } catch (error) {
      console.log(error.message);
      return res.status(200).json({
        error,
      });
    }
  },
};
