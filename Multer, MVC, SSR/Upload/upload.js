import multer from 'multer'

const storageUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage: storageUpload,
  fileFilter: function (req, file, cb) {
    const { mimetype } = file
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(mimetype)) {
      cb(new Error(`Can't handle this type: ${mimetype}`))
      return
    }
    cb(null, file)
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

export { upload }