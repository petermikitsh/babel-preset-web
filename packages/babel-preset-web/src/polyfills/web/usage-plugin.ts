import {
  BuiltIns,
  PossibleGlobalObjects
} from './built-in-definitions';
import {
  createImport,
  getType,
  has,
  intersection,
} from '../../utils';
import { logUsagePolyfills } from '../../debug';
import { InternalPluginOptions } from '../../types';
import filterItems from '../../filter-items';

function resolveKey(path: any, computed?: any) {
  const { node, parent, scope } = path;
  if (path.isStringLiteral()) return node.value;
  const { name } = node;
  const isIdentifier = path.isIdentifier();
  if (isIdentifier && !(computed || parent.computed)) return name;
  if (!isIdentifier || scope.getBindingIdentifier(name)) {
    const { value } = path.evaluate();
    if (typeof value === "string") return value;
  }
}

function resolveSource(path) {
  const { node, scope } = path;
  let builtIn, instanceType;
  if (node) {
    builtIn = node.name;
    if (!path.isIdentifier() || scope.getBindingIdentifier(builtIn)) {
      const { deopt, value } = path.evaluate();
      if (value !== undefined) {
        instanceType = getType(value);
      } else if (deopt && deopt.isIdentifier()) {
        builtIn = deopt.node.name;
      }
    }
  }
  return { builtIn, instanceType };
}

export default function(
  _: any,
  {
    polyfillTargets,
    debug,
  }: InternalPluginOptions,
) {
  // Version listed is the first that the target natively ships
  // with full support (e.g., does *not* require a polyfill)
  const polyfillData = {
    "whatwg-fetch": {
      "edge": "14",
      "chrome": "42",
      "firefox": "39",
      "safari": "10.1",
      "opera": "29",
      "samsung": "4",
      "ios": "10.3",
      "android": "67"
    },
    "intl": {
      "edge": "12",
      "ie": "11",
      "chrome": "24",
      "firefox": "29",
      "safari": "10",
      "opera": "15",
      "samsung": "4",
      "ios": "10.2",
      "android": "4.4"
    }
  };

  // NPM modules to be (potentially) added to import 
  // Pare down all available based on our targets
  // e.g, const polyfills = new Set([
  //   'intl',
  //   'whatwg-fetch'
  // ]);
  const polyfills: Set<string> = filterItems(
    polyfillData,
    new Set(),
    new Set(),
    polyfillTargets,
    null
  );

  const addAndRemovePolyfillImports = {
    // to-do-- typings: path is a NodePath (@babel/traverse)
    // e.g., window.fetch('http://www.example.com').then(...)
    MemberExpression(path) {
      const source = resolveSource(path.get("object"));
      const key = resolveKey(path.get("property"));
      this.addPropertyDependencies(source, key);
    },
    // to-do-- typings: the first parameter is a NodePath (@babel/traverse)
    // e.g., fetch('http://www.example.com').then(...)
    ReferencedIdentifier({ node: { name }, scope }: any) {
      if (scope.getBindingIdentifier(name)) return;
      this.addBuiltInDependencies(name);
    },
  };

  return {
    name: "web-usage",
    pre() {
      this.polyfillsSet = new Set();

      this.addUnsupported = function(builtIn) {
        const modules = Array.isArray(builtIn) ? builtIn : [builtIn];
        for (const module of modules) {
          this.polyfillsSet.add(module);
        }
      };

      this.addBuiltInDependencies = function(builtIn) {
        if (has(BuiltIns, builtIn)) {
          const BuiltInDependencies = BuiltIns[builtIn];
          this.addUnsupported(BuiltInDependencies);
        }
      };

      this.addPropertyDependencies = function(source = {}, key) {
        const { builtIn } = source;
        if (PossibleGlobalObjects.has(builtIn)) {
          this.addBuiltInDependencies(key);
        }
      };
    },
    // to-do-- typings: path is a NodePath (@babel/traverse)
    post({ path }: { path: any }) {
      const filtered = intersection(polyfills, this.polyfillsSet, polyfills);
      const reversed = Array.from(filtered).reverse();

      for (const module of reversed) {
        createImport(path, module);
      }

      if (debug) {
        logUsagePolyfills(
          filtered,
          this.file.opts.filename,
          polyfillTargets,
          {
            "whatwg-fetch": {
            },
          },
        );
      }
    },
    visitor: addAndRemovePolyfillImports,
  };
}
