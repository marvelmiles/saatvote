import multer from "multer";
import path from "path";
import fs from "fs";

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = path.resolve();
    cb(null, path.resolve(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    console.log("stroing...file", file.filename);
    cb(
      null,
      (req.body.name || file.fieldname) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, callback) => {
  let pattern = /jpg|jpeg|png|svg/; // reqex

  if (pattern.test(path.extname(file.originalname))) {
    callback(null, true);
  } else {
    callback("Error: not a valid file");
  }
};

const _upload = multer({
  storage: storageEngine,
  fileFilter,
});

export const deleteFileSync = (filePath) => {
  try {
    console.log("deleting file... ", filePath);
    const __dirname = path.resolve();
    filePath = path.join(__dirname, filePath);
    fs.unlinkSync(filePath);
    return true;
  } catch (err) {
    console.log(`Encountered error deleting file ${filePath}`);
    return false;
  }
};

export const upload = (req, res, next) => {
  const inputName = req.body.upload || "avatar";
  (req.query.upload === "single"
    ? _upload.single(inputName)
    : _upload.array(
        inputName,
        parseInt(
          req.query.maxUpload >= 1 && req.query.maxUpload <= 30
            ? req.query.maxUpload
            : 5
        )
      ))(req, res, next);
};

export const createFileObj = (file, alt = "", type = "user") => {
  if (file) {
    if (type === "user") {
      return {
        alt,
        src: `${process.env.BACKEND_URL}/uploads/${req.file.filename}`,
        mimetype: file.mimetype,
      };
    }
  } else if (type === "user") {
    return {
      src: `${process.env.BACKEND_URL}/uploads/defaultUser.png`,
      alt: "Blank avatart",
      mimetype: "image/png",
    };
  } else
    return {
      src: "",
      alt: "",
      mimetype: "",
    };
};
