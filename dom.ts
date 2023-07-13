// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import {
  type VAttr,
  type VElement,
  type VFragment,
  type VNode,
  VNodeType,
  type VText,
} from "./types.ts";

export interface ElementLike<Attr> extends NodeLike {
  setAttributeNode(attr: Attr): void;
}

export interface NodeLike {
  appendChild(node: unknown): void;
}

export interface AttrLike {
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

export function createNode<
  Element extends ElementLike<Attr>,
  Attr extends AttrLike,
  DocumentFragment extends NodeLike,
  Text,
>(
  node: VNode,
  document: DocumentLike<Element, Attr, DocumentFragment, Text>,
): Element | Attr | Text | DocumentFragment {
  switch (node.nodeType) {
    case VNodeType.Element:
      return createElement(node, document);

    case VNodeType.Attribute:
      return createAttr(node, document);

    case VNodeType.Text:
      return createText(node, document);

    case VNodeType.Fragment:
      return createDocumentFragment(node, document);
  }
}

export function createElement<
  Element extends ElementLike<Attr>,
  Attr extends AttrLike,
  DocumentFragment extends NodeLike,
  Text,
>(
  node: VElement,
  document: DocumentLike<Element, Attr, DocumentFragment, Text>,
): Element {
  const element = document.createElement(node.tagName);
  const attrs = node.attributes.map((node) => createAttr(node, document));
  const children = node.children.map((node) => createNode(node, document));

  attrs.forEach(element.setAttributeNode.bind(element));
  children.forEach(element.appendChild.bind(element));

  return element;
}

export function createText<Text>(
  node: VText,
  document: TextBuilder<Text>,
): Text {
  return document.createTextNode(node.data);
}

export function createDocumentFragment<
  Element extends ElementLike<Attr>,
  Attr extends AttrLike,
  DocumentFragment extends NodeLike,
  Text,
>(
  node: VFragment,
  document: DocumentLike<Element, Attr, DocumentFragment, Text>,
) {
  const documentFragment = document.createDocumentFragment();
  const elements = node.children.map((node) => createNode(node, document));

  elements.forEach(documentFragment.appendChild.bind(documentFragment));

  return documentFragment;
}

export function createAttr<Attr extends AttrLike>(
  node: VAttr,
  document: AttributeBuilder<Attr>,
): Attr {
  const attr = document.createAttribute(node.name);
  attr.value = node.value;

  return attr;
}
