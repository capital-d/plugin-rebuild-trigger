import { Payload } from 'payload';

export const seed = async (payload: Payload) => {
  payload.logger.info('Seeding data...');

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@payloadcms.com',
      password: 'test',
    },
  });


};