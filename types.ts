// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export enum VNodeType {
  Element = 1,
  Attribute,
  Text,
  Fragment = 11,
}

interface Node {
  nodeType: VNodeType;
}

export interface VElement extends Node {
  nodeType: VNodeType.Element;
  tagName: string;
  attributes: VAttr[];
  children: VNode[];
}

export interface VFragment extends Node {
  nodeType: VNodeType.Fragment;
  children: VNode[];
}

export interface VAttr extends Node {
  nodeType: VNodeType.Attribute;
  name: string;
  value: string;
}

export interface VText extends Node {
  nodeType: VNodeType.Text;
  data: string;
}

export type VNode = VElement | VFragment | VAttr | VText;
