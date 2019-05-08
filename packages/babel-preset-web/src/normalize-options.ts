import invariant from 'invariant';
import { TopLevelOptions, UseBuiltInsOption } from './options';
import { isBrowsersQueryValid } from './targets-parser';
import { findSuggestion } from './utils';

import {
  BuiltInsOption,
  Options,
} from "./types";

const validateTopLevelOptions = (options: Options) => {
  const validOptions = Object.keys(TopLevelOptions);

  for (const option in options) {
    if (!TopLevelOptions[option]) {
      throw new Error(
        `Invalid Option: ${option} is not a valid top-level option.
        Maybe you meant to use '${findSuggestion(validOptions, option)}'?`,
      );
    }
  }
};

const normalizeTargets = targets => {
  // TODO: Allow to use only query or strings as a targets from next breaking change.
  if (isBrowsersQueryValid(targets)) {
    return { browsers: targets };
  }
  return {
    ...targets,
  };
};

export const validateConfigPathOption = (
  configPath: string = global.process.cwd(),
) => {
  invariant(
    typeof configPath === "string",
    `Invalid Option: The configPath option '${configPath}' is invalid, only strings are allowed.`,
  );
  return configPath;
};

export const validateBoolOption = (
  name: string,
  value: boolean,
  defaultValue: boolean,
) => {
  if (typeof value === "undefined") {
    value = defaultValue;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Preset env: '${name}' option must be a boolean.`);
  }

  return value;
};

export const validateIgnoreBrowserslistConfig = (
  ignoreBrowserslistConfig: boolean,
) =>
  validateBoolOption(
    TopLevelOptions.ignoreBrowserslistConfig,
    ignoreBrowserslistConfig,
    false,
  );

export const validateUseBuiltInsOption = (
  builtInsOpt: BuiltInsOption = false,
) => {
  invariant(
    UseBuiltInsOption[builtInsOpt.toString()] ||
      UseBuiltInsOption[builtInsOpt.toString()] === UseBuiltInsOption.false,
    `Invalid Option: The 'useBuiltIns' option must be either
    'false' (default) to indicate no polyfills or
    '"usage"' to import only used polyfills per file`,
  );

  return builtInsOpt;
};

export default function normalizeOptions(opts: Options) {
  validateTopLevelOptions(opts);

  return {
    configPath: validateConfigPathOption(opts.configPath),
    debug: validateBoolOption(TopLevelOptions.debug, opts.debug, false),
    ignoreBrowserslistConfig: validateIgnoreBrowserslistConfig(
      opts.ignoreBrowserslistConfig,
    ),
    targets: normalizeTargets(opts.targets),
    useBuiltIns: validateUseBuiltInsOption(opts.useBuiltIns),
  };
}
