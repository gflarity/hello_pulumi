import * as pulumi from "@pulumi/pulumi";
import { Hello } from "./lib/hello";

const hello = new Hello("hello", { who: "world!" });
export const greeting = hello.greeting;
