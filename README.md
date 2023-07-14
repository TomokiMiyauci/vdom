# vdom

Virtual DOM specification and diff-patch algorithm.

## Background

Various projects with virtual-dom at their core have problems with their
modularity.

In particular, the codebase is chaotic, with a mixture of declarative HTML and
reactive programming.

This project provides a virtual-dom module for doing declarative HTML.

## Install

deno.land:

```ts
import * as mod from "https://deno.land/x/vdom/mod.ts";
```

npm:

```bash
npm i @miyauci/vdom
```

## Usage

```ts
/// <reference lib="dom" />
import {
  createElement,
  diff,
  patch,
  type VElement,
  VNodeType,
} from "https://deno.land/x/vdom/mod.ts";

function app(count: number): VElement {
  return {
    nodeType: VNodeType.Element,
    tagName: "div",
    attributes: [{
      nodeType: VNodeType.Attr,
      name: "style",
      value: "color: red;",
    }],
    children: [
      { nodeType: VNodeType.Text, data: count.toFixed() },
    ],
  };
}

let count = 0;
let vnode = app(count);
const element = createElement(vnode, document);
const root = document.body.append(element);

setInterval(() => {
  const newVNode = app(++count);
  const patches = diff(vnode, newVNode);

  patch(rootNode, patches, document);
  element = newElement;
}, 1000);
```

## API

See [deno doc](https://deno.land/x/vdom?doc) for all APIs.

## Contributing

See [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi
