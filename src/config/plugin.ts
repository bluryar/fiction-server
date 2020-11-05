import { EggPlugin } from "midway";
export default {
  static: true, // default is true
  validateJoi: {
    enable: true,
    package: "egg-validate-joi",
  },
  cors: {
    enable: true,
    package: "egg-cors",
  },
} as EggPlugin;
