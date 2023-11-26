import * as pulumi from "@pulumi/pulumi";
import { jsonStringify } from "@pulumi/pulumi";
import { Console } from "console";
import { checkResources } from "./checkly";

pulumi.runtime.setMocks({
  newResource: function (args: pulumi.runtime.MockResourceArgs): { id: string, state: any } {
    return {
      id: args.inputs.name + "_id",
      state: args.inputs,
    };
  },
  call: function (args: pulumi.runtime.MockCallArgs) {
    return args.inputs;
  },
},
  "project",
  "stack",
  false, // Sets the flag `dryRun`, which indicates if pulumi is running in preview mode.
);

describe("Checks", function () {
  let infra: typeof import("./checkly");

  before(async function () {
    infra = await import("./checkly");
  })

  describe("#location", function () {
    it("location must be europe", function (done) {
      let locationOfAllTestIsEurope = true;
      pulumi.all(checkResources.map(item => item.locations)).apply((locations) => {
        locations.flat().forEach(l => {
          if (!locationOfAllTestIsEurope) {
            return
          }
          l.startsWith("eu-") ? locationOfAllTestIsEurope = true : locationOfAllTestIsEurope = false
        });
        locationOfAllTestIsEurope ? done() : done(new Error(`All locations should be in eu-`))
      });
    });
  });
});