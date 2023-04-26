import logger from "./logger";

export interface IPluginActions<L, R, P> {
  load(): L;
  read(event: string, data: any): R;
  process(event: string, data: any): P;
}

export interface IPlugin<L, R, P> extends IPluginActions<L, R, P> {
  id: string;
  name: string;
  version: string;
  description?: string;
}

export interface Plugin<L, R, P> {
  id: string;
  name: string;
  version: string;
  description?: string;
  plugin: IPluginActions<L, R, P>;
}

export interface PluginDefinition {
  id: string;
  modulePath: string;
}

export class PluginManager {
  private static instance: PluginManager;

  static getInstance() {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  private constructor() {}
  private plugins: Plugin<any, any, any>[] = [];

  async loadPlugins(
    pluginDefinitions: PluginDefinition[]
  ): Promise<Plugin<any, any, any>[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const plugins: Plugin<any, any, any>[] = await Promise.all(
      pluginDefinitions.map(async (pluginDefinition) => {
        await this.loadPluginFromUrl(pluginDefinition.modulePath);

        const plugin = (window as any)["plugins"][
          pluginDefinition.id
        ] as IPlugin<any, any, any>;

        if (!plugin) {
          throw new Error(
            `Plugin ${pluginDefinition.id} does not implement the required interface`
          );
        }
        await plugin.load();

        const { id, name, version, description, ...other } = plugin;
        return {
          id,
          name,
          version,
          description,
          plugin: other,
        };
      })
    );

    return plugins;
  }

  loadPluginFromUrl = async (url: string): Promise<void> => {
    const pluginURL = `${url}/dist/module.js`;
    const script = document.createElement("script");
    script.src = pluginURL;
    script.type = "module";

    const scriptLoaded = new Promise((resolve, reject) => {
      script.onload = () => resolve("Loaded");
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${pluginURL}`));
    });

    document.head.appendChild(script);
    await scriptLoaded;
  };
}

export const registerPlugin = (plugin: IPlugin<any, any, any>) => {
  const _plugin: IPlugin<any, any, any> = {
    ...plugin,
  };
  (window as any)["plugins"][_plugin.id] = {
    _plugin,
    logger: {
      log: (...messages: any[]) => logger.log(_plugin.id, ...messages),
      debug: (...messages: any[]) => logger.debug(_plugin.id, ...messages),
      error: (...messages: any[]) => logger.error(_plugin.id, ...messages),
      info: (...messages: any[]) => logger.info(_plugin.id, ...messages),
      warn: (...messages: any[]) => logger.warn(_plugin.id, ...messages),
    },
  };
};
