export const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  setEx: jest.fn().mockResolvedValue('OK'),
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(null),
  quit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  isOpen: true,
};

export const createClient = jest.fn(() => mockRedisClient);
