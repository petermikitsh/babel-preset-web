// Map identifers to their respective polyfills
export const BuiltIns = {
  Intl: ['intl'],
  fetch: ['whatwg-fetch']
};

export const PossibleGlobalObjects = new Set<string>([
  "global",
  "globalThis",
  "self",
  "window",
]);
