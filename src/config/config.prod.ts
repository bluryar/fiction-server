import { resolve as pathResolve } from 'path';

export const development = {
  watchDirs: [
    'app',
    'lib',
    'service',
    'config',
    'app.ts',
    'agent.ts',
    'interface.ts',
  ],
  overrideDefault: true,
};

export const typeorm = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'love830',
  database: 'fiction-dev',
  synchronize: true,
  logging: false,
  entities: [pathResolve(__dirname, '../app/entity/**/*.js')],
  // migrations: ['app/migration/**/*.ts'],
  // subscribers: ['app/subscriber/**/*.ts'],
  cli: {
    // entitiesDir: "app/entity",
    // migrationsDir: 'app/migration',
    // subscribersDir: 'app/subscriber',
  },
};
