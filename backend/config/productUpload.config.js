import multer from "multer";
import path from "path";
import fs from "fs"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const location = "./uploads/products/"
        fs.mkdirSync(location, {recursive: true})
        cb(null, location);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        
        //const filename = file.originalname.split(".")[0];
        const extension = file.originalname.split(".")[1];
        cb(null, `${req?.body?.name?.replace(" ","").toLowerCase()}_${uniqueSuffix}.${extension}`);
    },
});

const fileFilter = (req, file, cb) =>  {
    const fileTypes = /png|jpg|jpeg|webp/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extName && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: jpeg | png | jpg | webp only");
    }
  }

  const onError = (err, next) => {
    console.log('error', err);
    next(err);
  }
  
// Init multer storage engine
const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 1000000}, // 1MB file size limit
  onError,
});

export default upload;