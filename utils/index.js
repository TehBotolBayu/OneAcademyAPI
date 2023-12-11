const ImageKit = require("imagekit");

module.exports = {
  imageKit: new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_SECRET_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  }),
};
