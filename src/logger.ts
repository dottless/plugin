const log = (pluginID?: any, ...optionalParams: any[]) => {
  console.log(`[${pluginID}]`, ...optionalParams);
};

const debug = (pluginID?: any, ...optionalParams: any[]) => {
  console.debug(`[${pluginID}]`, ...optionalParams);
};

const error = (pluginID?: any, ...optionalParams: any[]) => {
  console.error(`[${pluginID}]`, ...optionalParams);
};

const info = (pluginID?: any, ...optionalParams: any[]) => {
  console.info(`[${pluginID}]`, ...optionalParams);
};

const warn = (pluginID?: any, ...optionalParams: any[]) => {
  console.warn(`[${pluginID}]`, ...optionalParams);
};

export const logger = { log, debug, error, info, warn };
