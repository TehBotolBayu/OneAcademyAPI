const ImageKit = require("imagekit");

const formatDateTime = (dateInput) => {
  const date = new Date(dateInput);
  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12 :false
  })
}


module.exports = {
  formatDateTime,
  imageKit: new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_SECRET_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  }),
};
