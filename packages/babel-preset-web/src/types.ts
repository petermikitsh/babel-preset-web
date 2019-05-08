export type Target =
  | "node"
  | "chrome"
  | "opera"
  | "edge"
  | "firefox"
  | "safari"
  | "ie"
  | "ios"
  | "android"
  | "electron"
  | "samsung";

export type Targets = {
  [key in Target]?: string;
};

export type BuiltInsOption = false | "usage";
export type PluginListItem = string | RegExp;
export type PluginListOption = Array<PluginListItem>;

export type Options = {
  configPath?: string,
  debug?: boolean,
  exclude?: PluginListOption,
  forceAllTransforms?: boolean,
  ignoreBrowserslistConfig?: boolean,
  include?: PluginListOption,
  loose?: boolean,
  shippedProposals?: boolean,
  spec?: boolean,
  targets?: Targets,
  useBuiltIns?: BuiltInsOption,
};

export type Plugin = [Object, Object];

export type InternalPluginOptions = {
  polyfillTargets: Targets,
  debug: boolean
};
