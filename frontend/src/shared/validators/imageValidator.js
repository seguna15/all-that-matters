export const imagesValidator = (images) => {
  let newErrs = [];
    let acceptableTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (images.length > 0) {
    if(images.length > 8) {
        newErrs.push("Images more than 8 limit")
        return newErrs
    }
    images.forEach((file) => {
      if (file?.size > 1000000) {
        newErrs.push(`${file?.name} is too large`);
      }

      /* if (!file?.type?.startsWith("image/")) {
        newErrs.push(`${file?.name} is not an image`);
      } */

      if(!acceptableTypes.includes(file?.type)){
        newErrs.push(`${file?.name} is not an acceptable image format`)
      }
    });
  } else {
    if (images?.size > 1000000) {
      newErrs.push(`${images?.name} is too large`);
    }

    /* if (!images?.type?.startsWith("image/")) {
      newErrs.push(`${images?.name} is not an image`);
    } */

    if (!acceptableTypes.includes(images?.type)) {
      newErrs.push(`${file?.name} is not an acceptable image format`);
    }
  }

  return newErrs;
};
