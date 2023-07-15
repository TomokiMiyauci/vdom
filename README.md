# vdom

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/vdom)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/vdom?doc)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/vdom)](https://github.com/TomokiMiyauci/vdom/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/vdom/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/vdom)
[![License](https://img.shields.io/github/license/TomokiMiyauci/vdom)](LICENSE)

[![test](https://github.com/TomokiMiyauci/vdom/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/vdom/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@miyauci/vdom.png?mini=true)](https://nodei.co/npm/@miyauci/vdom/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

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
      nodeType: VNodeType.Attribute,
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
const root = createElement(vnode, document);
document.body.append(root);

setInterval(() => {
  const newVNode = app(++count);
  const patches = diff(vnode, newVNode);

  patch(root, patches, document);
  vnode = newVNode;
}, 1000);
```

## Documentation

- [FAQ](docs/faq.md)

## API

See [deno doc](https://deno.land/x/vdom?doc) for all APIs.

## Contributing

See [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi
