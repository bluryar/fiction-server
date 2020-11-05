import { EggAppConfig, EggAppInfo, PowerPartial } from "midway";
import { resolve as pathResolve } from "path";

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = 'talchs-fiction';

  // add your config here
  config.middleware = [];

  config.crawlerSrcDir = pathResolve(
    "C:\\",
    "/Users/blury/VscodeProject/2020/Spider/Crawler/src"
  );

  config.validateJoi = {
    options: {
      abortEarly: false, // when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
    },
  };

  config.cors = {
    // {string|Function} origin: '*',
    origin: "*",
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };

  return config;
};
