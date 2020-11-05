import { resolve as pathResolve } from 'path';

export const typeorm = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'love830',
  database: 'fiction-test',
  synchronize: true,
  logging: false,
  entities: [pathResolve(__dirname, '../app/entity/**/*.ts')],
  // migrations: ['app/migration/**/*.ts'],
  // subscribers: ['app/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'app/entity',
    //   migrationsDir: 'app/migration',
    //   subscribersDir: 'app/subscriber',
  },
};
