import {
  describe, test, expect, jest, beforeEach,
} from '@jest/globals';
import { BUCKET_NAME } from '../../commons/constants.mjs';
import MinioService from '../MinioService.mjs';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
}));

describe('MinioService', () => {
  let minioService;

  beforeEach(() => {
    minioService = new MinioService();
  });

  test('saveImage throws error if image is missing', async () => {
    await expect(minioService.saveImage()).rejects.toThrow('Image is required');
  });

  test('saveImage throws error if image originalname is missing', async () => {
    await expect(minioService.saveImage({})).rejects.toThrow('Image originalname is required');
  });

  test('saveImage throws error if image buffer is missing', async () => {
    await expect(minioService.saveImage({ originalname: 'image.png' })).rejects.toThrow('Image buffer is required');
  });

  test('saveImage throws error if image name is invalid', async () => {
    await expect(minioService.saveImage({ originalname: 'image', buffer: Buffer.from('') })).rejects.toThrow('Invalid image name');
  });

  test('saveImage saves the image successfully', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from(''),
    };

    // Genera un nombre de archivo basado en algún criterio
    const expectedFileName = 'image.png'; // Ajusta el nombre esperado

    const mockPutObjectCommand = jest.fn().mockImplementation(() => ({
      Bucket: BUCKET_NAME,
      Key: expectedFileName, // Utiliza el nombre esperado
      Body: image.buffer,
    }));

    minioService.conn.send = jest.fn().mockImplementation(mockPutObjectCommand);
  });

  test('saveImage throws internal error if an unexpected error occurs', async () => {
    const image = {
      originalname: 'image.png',
      buffer: Buffer.from(''),
    };

    minioService.conn.send = jest.fn().mockRejectedValue(new Error('unexpected error'));

    await expect(minioService.saveImage(image)).rejects.toThrow('Error saving image');
  });
});
