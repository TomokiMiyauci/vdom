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

export interface ElementLike<Attr> extends NodeLike, ChildNodeLike {
  setAttributeNode(attr: Attr): void;
  setAttribute(qualifiedName: string, value: string): void;
  removeAttribute(qualifiedName: string): void;
}

export interface NodeLike {
  appendChild(node: NodeLike): void;

  childNodes: {
    [index: number]: ChildNodeLike;
  };
}

export interface ChildNodeLike extends NodeLike {
  /**
   * Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.
   *
   * Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/replaceWith)
   */
  replaceWith(...nodes: (NodeLike | string)[]): void;

  /**
   * Removes node.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/remove)
   */
  remove(): void;
}

export interface AttrLike extends NodeLike {
  value: string;
}

export interface DocumentLike<
  Element,
  Attr extends AttrLike,
  DocumentFragment,
  Text,
> extends AttributeBuilder<Attr>, TextBuilder<Text> {
  /** Creates an {@linkcode Element}. */
  createElement(tagName: string): Element;

  /** Creates a {@linkcode DocumentFragment} */
  createDocumentFragment(): DocumentFragment;
}

export interface AttributeBuilder<Attr extends AttrLike> {
  /** Creates an {@linkcode Attr} node. */
  createAttribute(qualifiedName: string): Attr;
}

export interface TextBuilder<Text> {
  /** Creates a {@linkcode Text} node. */
  createTextNode(data: string): Text;
}
