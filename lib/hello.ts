import * as pulumi from "@pulumi/pulumi";
import { randomUUID } from "crypto";

/**
 * Based on the Dynamic Provider Blog Post: https://www.pulumi.com/docs/concepts/resources/dynamic-providers/
 */

export interface HelloResourceInputs {
  who: pulumi.Input<string>;
}

interface HelloProviderInputs {
  who: string;
}

export interface HelloResourceOutputs {
  greeting: pulumi.Output<string>;
}

interface HelloProviderOutputs {
  greeting: string;
}

const helloProvider: pulumi.dynamic.ResourceProvider<
  HelloProviderInputs,
  HelloProviderOutputs
> = {
  async create(
    inputs: HelloProviderInputs
  ): Promise<pulumi.dynamic.CreateResult<HelloProviderOutputs>> {
    const greeting = `Hello ${inputs.who}`;
    return { id: randomUUID(), outs: { greeting } };
  },
  async diff(
    id: string,
    oldOutputs: HelloProviderOutputs,
    newInputs: HelloProviderInputs
  ): Promise<pulumi.dynamic.DiffResult> {
    return { changes: true };
  },
  async update(
    id: string,
    olds: HelloProviderOutputs,
    news: HelloProviderInputs
  ): Promise<pulumi.dynamic.UpdateResult<HelloProviderOutputs>> {
    const greeting = `Hello ${news.who}`;
    return { outs: { greeting } };
  },
};

export class Hello extends pulumi.dynamic.Resource {
  public readonly greeting!: pulumi.Output<string>;

  constructor(
    name: string,
    props: HelloResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(helloProvider, name, { greeting: undefined, ...props }, opts);
  }
}
