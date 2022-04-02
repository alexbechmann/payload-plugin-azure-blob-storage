# helm-parser

Template a helm chart, and load into a JavaScript object.

## Installation

```bash
npm install helm-parser
```

## Usage

```ts

```

## Usage with Mocha

```ts
import { describe, it } from "mocha";
import { expect } from "chai";
import path from "path";
import { createHelmParser } from "helm-parser";
import { ValuesSchema } from "./values-schema";

const helmParser = createHelmParser<ValuesSchema>({
  chartPath: path.resolve(__dirname, "../charts/my-chart"),
});

describe("chart tests", () => {
  it("can set replicas to 3", () => {
    const { manifests } = helmParser.template({
      namespace: "my-namespace",
      releaseName: "my-release",
      values: {
        replicaCount: 3,
      },
    });
    const deployment = manifests.filter((manifest) => manifest.kind === "Deployment")[0];
    expect(deployment.spec.replicas).to.equal(3);
  });
});
```
