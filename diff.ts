// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { distinct, zip } from "./deps.ts";
import { VFragment } from "./mod.ts";
import {
  type VAttr,
  type VElement,
  type VNode,
  VNodeType,
  type VText,
} from "./types.ts";

export interface Common {
  type: DiffType;
  paths: readonly number[];
}

export interface ModifyDiff extends Common {
  type: DiffType.Modify;
  from: VNode;
  to: VNode;
}

export interface AddDiff extends Common {
  type: DiffType.Add;
  node: VNode;
}

export interface DeleteDiff extends Common {
  type: DiffType.Delete;
  node: VNode;
}

export type Diff = ModifyDiff | AddDiff | DeleteDiff;

export enum DiffType {
  Add,
  Delete,
  Modify,
}

export function diff(
  left: VNode,
  right: VNode,
  paths: readonly number[] = [],
): Diff[] {
  if (left === right) return [];

  if (left.nodeType !== right.nodeType) {
    return [{
      type: DiffType.Modify,
      from: left,
      to: right,
      paths,
    }];
  }

  switch (left.nodeType) {
    case VNodeType.Element: {
      if (left.tagName !== (right as VElement).tagName) {
        return [{ type: DiffType.Modify, to: right, from: left, paths }];
      }

      const leftAttrs = new Map<string, VAttr>(
        left.attributes.map(attr2Entry),
      );
      const rightAttrs = new Map<string, VAttr>(
        (right as VElement).attributes.map(attr2Entry),
      );

      const diffs = distinct([...leftAttrs.keys(), ...rightAttrs.keys()])
        .reduce((acc, key) => {
          if (!leftAttrs.has(key)) {
            const diff: Diff = {
              type: DiffType.Add,
              paths,
              node: rightAttrs.get(key)!,
            };

            return acc.concat(diff);
          }

          if (!rightAttrs.has(key)) {
            const diff: Diff = {
              type: DiffType.Delete,
              paths,
              node: leftAttrs.get(key)!,
            };

            return acc.concat(diff);
          }

          const left = leftAttrs.get(key)!;
          const right = rightAttrs.get(key)!;

          return acc.concat(diffAttr(left, right, paths));
        }, [] as Diff[]);
      const allDiff = diffChildren(
        left.children,
        (right as VFragment).children,
        paths,
      );

      return diffs.concat(allDiff);
    }

    case VNodeType.Attribute:
      return diffAttr(left, right as VAttr, paths);

    case VNodeType.Text:
      return diffVText(left, right as VText, paths);

    case VNodeType.Fragment:
      return diffChildren(left.children, (right as VFragment).children, paths);
  }
}

export function diffAttr(
  left: VAttr,
  right: VAttr,
  paths: readonly number[] = [],
): Diff[] {
  if (left.value === right.value) return [];

  const diff: Diff = {
    type: DiffType.Modify,
    from: left,
    to: right,
    paths,
  };

  return [diff];
}

export function diffChildren(
  left: VNode[],
  right: VNode[],
  paths: readonly number[] = [],
): Diff[] {
  const allDiff = zip(left, right).flatMap(([left, right], index) =>
    diff(left, right, paths.concat(index))
  );

  const additional = right.slice(left.length).map((node) => {
    const diff: AddDiff = {
      type: DiffType.Add,
      node: node,
      paths,
    };

    return diff;
  });
  const optionals = left.slice(right.length).map((node, index) => {
    const diff: DeleteDiff = {
      type: DiffType.Delete,
      node: node,
      paths: paths.concat(right.length + index),
    };

    return diff;
  });

  return allDiff.concat(additional).concat(optionals);
}

type Entry<K, V> = [key: K, value: V];

function attr2Entry(attr: VAttr): Entry<string, VAttr> {
  return [attr.name, attr];
}

export function diffVText(
  left: VText,
  right: VText,
  paths: readonly number[] = [],
): Diff[] {
  if (left.data === right.data) return [];

  return [{ type: DiffType.Modify, from: left, to: right, paths }];
}
