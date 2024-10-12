import fs from "fs";
const deleteImages = async (images) => {
  images.forEach((file) => {
    fs.unlinkSync(file, (err) => {
      console.log(err);
      throw new ErrorHandler("Image could not be deleted");
    });
  });
};

export default deleteImages;
