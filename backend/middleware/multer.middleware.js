const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/property-images/')
  },
  filename: (req, file, cb) => {
    cb(null, `property_image_${file.originalname.split(" ").join("")}`)
  },
})

const upload = multer({ storage: storage })

module.exports = { upload };