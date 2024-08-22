// // src/config/multer-config.ts
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { cloudinary } from './cloudinary.config';
// import multer from 'multer';
// import { BadRequestException } from '@nestjs/common';

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const allowedFormats = ['jpeg', 'png', 'jpg'];
//     const ext = file.mimetype.split('/')[1];
//     return {
//       folder: 'products',
//       format: allowedFormats.includes(ext) ? ext : 'jpeg', // Default to 'jpeg' if format is not allowed
//       public_id: file.originalname.split('.')[0],
//     };
//   },
// });

// // Middleware untuk memeriksa format file
// const fileFilter = (req, file, cb) => {
//   const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
//   if (!allowedFormats.includes(file.mimetype)) {
//     return cb(
//       new BadRequestException(
//         'Invalid file format. Only JPEG, JPG, and PNG are allowed.',
//       ),
//       false,
//     );
//   }
//   cb(null, true);
// };

// const multerOptions = {
//   storage: storage,
//   fileFilter: fileFilter,
// };

// const upload = multerOptions;

// export { upload };
