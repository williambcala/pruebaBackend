import Boom from '@hapi/boom';

import {
  describe, it, expect, jest, afterEach,
} from '@jest/globals';
import HttpStatusCodes from 'http-status-codes';
import applyFiltersHandler from '../../handlers/filters/applyFiltersHandler.mjs';

// applyFiltersHandler.spec.mjs

describe('applyFiltersHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería manejar correctamente una solicitud exitosa', async () => {
    const mockRequest = {
      body: { /* datos de prueba */ },
      files: { /* archivos de prueba */ },
      container: {
        processService: {
          applyFilters: jest.fn().mockResolvedValue('resultado exitoso'),
        },
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    await applyFiltersHandler(mockRequest, mockResponse, mockNext);

    expect(mockRequest.container.processService.applyFilters).toHaveBeenCalledWith({
      ...mockRequest.body,
      images: mockRequest.files,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith('resultado exitoso');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debería manejar correctamente un error de Boom', async () => {
    const mockRequest = {
      body: { /* datos de prueba */ },
      files: { /* archivos de prueba */ },
      container: {
        processService: {
          applyFilters: jest.fn().mockRejectedValue(Boom.badRequest('mensaje de error')),
        },
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    try {
      await applyFiltersHandler(mockRequest, mockResponse, mockNext);
    } catch (error) {
      console.error('Error capturado:', error.message);
    }
  });

  it('debería manejar correctamente otros errores', async () => {
    const mockRequest = {
      body: { /* datos de prueba */ },
      files: { /* archivos de prueba */ },
      container: {
        processService: {
          applyFilters: jest.fn().mockRejectedValue(new Error('error genérico')),
        },
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    try {
      await applyFiltersHandler(mockRequest, mockResponse, mockNext);
    } catch (error) {
      console.error('Error capturado:', error.message);
    }

    // Muestra información sobre llamadas a funciones
    console.log('Llamadas a applyFilters:', mockRequest.container.processService.applyFilters.mock.calls);
    console.log('Llamadas a next:', mockNext.mock.calls);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
