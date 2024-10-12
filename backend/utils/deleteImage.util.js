import fs from "fs";
export const deleteImages = async (images) => {
  images.forEach((file) => {
    fs.unlinkSync(file, (err) => {
      throw new ErrorHandler("Image could not be deleted", 400);
    });
  });
};

export const deleteImage =async (image) => {
  fs.unlinkSync(image, (err) => {
    throw new ErrorHandler("Image could not be deleted", 400);
  });
}
export default deleteImages;
