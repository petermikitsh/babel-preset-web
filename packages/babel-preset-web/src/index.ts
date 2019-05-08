require('source-map-support').install();

import { declare } from '@babel/helper-plugin-utils';
import normalizeOptions from './normalize-options';
import getTargets from './targets-parser';
import { prettifyTargets } from './utils';
import addWebUsagePlugin from './polyfills/web/usage-plugin';

export default declare((api, opts) => {
  api.assertVersion(7);

  const {
    configPath,
    debug,
    ignoreBrowserslistConfig,
    targets: optionsTargets,
    useBuiltIns,
  } = normalizeOptions(opts);

  const targets = getTargets(optionsTargets, {
    ignoreBrowserslistConfig,
    configPath,
  });

  const plugins = [];

  if (debug) {
    console.log("@babel/preset-env: `DEBUG` option");
    console.log("\nUsing targets:");
    console.log(JSON.stringify(prettifyTargets(targets), null, 2));

    if (!useBuiltIns) {
      console.log(
        "\nUsing polyfills: No polyfills were added, since the `useBuiltIns` option was not set.",
      );
    } else {
      console.log(`\nUsing polyfills with \`${useBuiltIns}\` option:`);
    }
  }

  if (useBuiltIns === "usage") {
    const pluginOptions = {
      polyfillTargets: targets,
      debug,
    };
  
    plugins.push([addWebUsagePlugin, pluginOptions]);
  }

  return { plugins };
});
