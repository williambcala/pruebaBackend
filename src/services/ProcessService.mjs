import Joi from 'joi';
import Boom from '@hapi/boom';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../commons/constants.mjs';

class ProcessService {
  processRepository = null;

  minioService = null;

  payloadValidation = Joi.object({
    filters: Joi.array().required().min(1)
      .items(Joi.string().valid(NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER)),
    images: Joi.array().required().min(1),
  }).required();

  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(payload) {
    try {
      await this.payloadValidation.validateAsync(payload);
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }
    const { images, filters } = payload;
    const process = await this.processRepository.save({ filters });
    const imagesPromises = images.map((image) => this.minioService.saveImage(image));
    const imagesNames = await Promise.all(imagesPromises);
    // eslint-disable-next-line
    console.log(imagesNames);
    return process;
  }

  async getFilters(id) {
    // Metodo para tomar el id

    const process = await this.processRepository.find(id);
    return process;
  }
}
export default ProcessService;
