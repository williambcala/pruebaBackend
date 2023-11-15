import Boom from '@hapi/boom';
import HttpStatusCodes from 'http-status-codes';

const getFiltersHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await req.container.processService.getFilters(id);
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    next(err);
  }
  return next();
};

export default getFiltersHandler;
