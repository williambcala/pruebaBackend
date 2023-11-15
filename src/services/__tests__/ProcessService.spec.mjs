import {
  describe, test, expect, jest, beforeEach, afterEach,
} from '@jest/globals';
import ProcessRepository from '../../repositories/ProcessRepository.mjs';
import ProcessService from '../ProcessService.mjs';
import ProcessModel from '../../models/Process.mjs';

const suma = (a, b) => a + b;

describe('Test suma', () => {
  test('suma 1 + 2 = 3', () => {
    expect(suma(1, 2)).toBe(3);
  });

  test('suma 1 + 3 = 4', () => {
    expect(suma(1, 3)).toBe(4);
  });
});

describe('ProcessService tests', () => {
  const processRepository = new ProcessRepository();
  const minioService = {
    saveImage: jest.fn()
      .mockImplementationOnce(() => Promise.resolve('image1.png')),
  };
  const processService = new ProcessService({ processRepository, minioService });

  test('applyFilters function with invalid payload', () => {
    expect(processService.applyFilters()).rejects.toThrow();
    expect(processService.applyFilters({})).rejects.toThrow();
    expect(processService.applyFilters({ filters: [] })).rejects.toThrow();
  });

  test('applyFilters function with valid payload', async () => {
    const payload = {
      filters: ['negative'],
      images: [{ originalname: 'image1.png', buffer: Buffer.from('') }],
    };
    const expectedProcess = {
      id: '1234',
      filters: payload.filters,
      images: payload.images,
    };
    processRepository.save = jest.fn()
      .mockImplementationOnce(() => expectedProcess);
    const process = await processService.applyFilters(payload);
    expect(process).toMatchObject(expectedProcess);
  });

  test('getFilters function', async () => {
    const processId = '1234';
    const expectedProcess = {
      id: processId,
      filters: ['filter1', 'filter2'],
    };

    processRepository.find = jest.fn()
      .mockImplementationOnce(() => expectedProcess);

    const process = await processService.getFilters(processId);
    expect(process).toEqual(expectedProcess);
  });
});

describe('ProcessRepository tests', () => {
  let processRepository;

  beforeEach(() => {
    processRepository = new ProcessRepository();
  });

  afterEach(() => {
    // Limpia cualquier estado que pueda haber quedado después de cada prueba.
  });

  test('save method should save a process and return it', async () => {
    const processData = {
      filters: ['filter1', 'filter2'],
    };

    ProcessModel.prototype.save = jest.fn().mockResolvedValueOnce({ ...processData, id: '6532fadd342d6c980b39643c' });

    const savedProcess = await processRepository.save(processData);

    expect(savedProcess).toEqual(expect.objectContaining(processData));
    expect(savedProcess.id).toHaveLength(24);
    expect(ProcessModel.prototype.save).toHaveBeenCalledWith();
  });

  test('find method should find a process by ID', () => {
    const processId = '1234';
    const expectedProcess = {
      id: processId,
      filters: ['filter1', 'filter2'],
    };

    ProcessModel.findById = jest.fn()
      .mockImplementationOnce(() => expectedProcess);

    const foundProcess = processRepository.find(processId);
    expect(foundProcess).toEqual(expectedProcess);
  });
});
