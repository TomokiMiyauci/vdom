// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { Diff, DiffType } from "./diff.ts";
import { createAttr, createNode, DocumentLike } from "./dom.ts";
import {
  AttrLike,
  ChildNodeLike,
  ElementLike,
  NodeLike,
  VNodeType,
} from "./types.ts";
import { isVAttr } from "./utils.ts";

export function patch(
  root: ElementLike<AttrLike> | ChildNodeLike,
  diffs: readonly Diff[],
  document: DocumentLike<ElementLike<AttrLike>, AttrLike, NodeLike, NodeLike>,
): void {
  diffs.forEach((diff) => {
    const target = resolvePaths(root, diff.paths);

    switch (diff.type) {
      case DiffType.Modify: {
        if (isVAttr(diff.to)) {
          if ("setAttributeNode" in target) {
            target.setAttribute(diff.to.name, diff.to.value);
          }
        } else {
          const right = createNode(diff.to, document);

          target.replaceWith(right);
        }

        break;
      }

      case DiffType.Add: {
        switch (diff.node.nodeType) {
          case VNodeType.Attribute: {
            if ("setAttributeNode" in target) {
              const attr = createAttr(diff.node, document);

              target.setAttributeNode(attr);
            }

            break;
          }

          default: {
            const node = createNode(diff.node, document);

            target.appendChild(node);
            break;
          }
        }

        break;
      }

      case DiffType.Delete: {
        switch (diff.node.nodeType) {
          case VNodeType.Attribute: {
            if ("removeAttribute" in target) {
              target.removeAttribute(diff.node.name);
            }

            break;
          }

          default: {
            target.remove();

            break;
          }
        }

        break;
      }
    }
  });
}

export function resolvePaths<T extends NodeLike>(
  node: T,
  paths: readonly number[],
): T | ChildNodeLike {
  return paths.reduce(
    (acc, cur) => acc.childNodes[cur]!,
    node as T | ChildNodeLike,
  );
}
