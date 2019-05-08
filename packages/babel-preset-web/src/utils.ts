import invariant from 'invariant';
import levenshtein from 'js-levenshtein';
import { addSideEffect } from '@babel/helper-module-imports';
import semver from 'semver';
import unreleasedLabels from '../data/unreleased-labels';
import { semverMin } from './targets-parser';
import { Targets } from './types';

// to-do: Path is of type 'NodePath' from '@babel/traverse'
export function createImport(path: any, mod: string) {
  return addSideEffect(path, mod);
}

export const has = Object.hasOwnProperty.call.bind(Object.hasOwnProperty);

export function findSuggestion(options: string[], option: string): string {
  let levenshteinValue = Infinity;
  return options.reduce((suggestion, validOption) => {
    const value = levenshtein(validOption, option);
    if (value < levenshteinValue) {
      levenshteinValue = value;
      return validOption;
    }
    return suggestion;
  }, undefined);
}

export function getLowestUnreleased(a: string, b: string, env: string): string {
  const unreleasedLabel = unreleasedLabels[env];
  const hasUnreleased = [a, b].some(item => item === unreleasedLabel);
  if (hasUnreleased) {
    return a || b;
  }
  return semverMin(a, b);
}

export function getType(target: any): string {
  return Object.prototype.toString
    .call(target)
    .slice(8, -1)
    .toLowerCase();
}

export function intersection<T>(
  first: Set<T>,
  second: Set<T>,
  third: Set<T>,
): Set<T> {
  const result = new Set();
  for (const el of first) {
    if (second.has(el) && third.has(el)) result.add(el);
  }
  return result;
}

export function isUnreleasedVersion(version: string | number, env: string): boolean {
  const unreleasedLabel = unreleasedLabels[env];
  return (
    !!unreleasedLabel && unreleasedLabel === version.toString().toLowerCase()
  );
}

export function prettifyVersion(version: string) {
  if (typeof version !== "string") {
    return version;
  }

  const parts = [semver.major(version)];
  const minor = semver.minor(version);
  const patch = semver.patch(version);

  if (minor || patch) {
    parts.push(minor);
  }

  if (patch) {
    parts.push(patch);
  }

  return parts.join(".");
}

export function prettifyTargets(targets: Targets): Targets {
  return Object.keys(targets).reduce((results, target) => {
    let value = targets[target];

    const unreleasedLabel = unreleasedLabels[target];
    if (typeof value === "string" && unreleasedLabel !== value) {
      value = prettifyVersion(value);
    }

    results[target] = value;
    return results;
  }, {});
}

const versionRegExp = /^(\d+|\d+.\d+)$/;

// Convert version to a semver value.
// 2.5 -> 2.5.0; 1 -> 1.0.0;
export function semverify(version: number | string): string {
  if (typeof version === "string" && semver.valid(version)) {
    return version;
  }

  invariant(
    typeof version === "number" ||
      (typeof version === "string" && versionRegExp.test(version)),
    `'${version}' is not a valid version`,
  );

  const split = version.toString().split(".");
  while (split.length < 3) {
    split.push("0");
  }
  return split.join(".");
}
