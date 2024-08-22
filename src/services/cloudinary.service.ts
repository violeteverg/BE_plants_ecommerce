import { Injectable, BadRequestException } from '@nestjs/common';
import { cloudinary } from 'src/config/cloudinary.config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  private readonly MAX_SIZE = 10 * 1024 * 1024;

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    //validate image format
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and JPG are allowed.',
      );
    }

    //validate image size
    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException(
        'File size exceeds the maximum limit of 1 MB.',
      );
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'product',
          transformation: [
            { gravity: 'auto', height: 215, width: 215, crop: 'fill' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });
  }
}
