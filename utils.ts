// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { VAttr, VNode } from "./mod.ts";
import { VNodeType } from "./types.ts";

/** Whether the {@linkcode vnode} is {@linkcode VAttr} or not. */
export function isVAttr(vnode: VNode): vnode is VAttr {
  return vnode.nodeType === VNodeType.Attribute;
}
