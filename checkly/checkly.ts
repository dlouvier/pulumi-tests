import * as checkly from "@checkly/pulumi";

const apiChecks = {
  "checkly": {
    activated: true,
    frequency: 10,
    type: "API",
    request: {
      method: "GET",
      url: "https://checklyhq.com",
    },
    locations: ['eu-west-1'],
  },
  "dlou": {
    activated: true,
    frequency: 10,
    type: "API",
    request: {
      method: "GET",
      url: "https://dlou.es",
    },
    locations: ['eu-west-2'],
  },
}


const checks: checkly.Check[] = [];

(Object.keys(apiChecks) as (keyof typeof apiChecks)[]).forEach((key) => {
  const check = new checkly.Check(key, apiChecks[key]);
  checks.push(check)
});

export const checkResources = checks