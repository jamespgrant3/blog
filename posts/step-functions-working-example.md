---
title: step functions working example
tags: [aws, step-functions]
date: "2022-02-18"
---

This week I spent some time coming up with a sample step function use-case. I decided to roll with a customer potentially requesting a credit line increase.

You can find the repo [here](https://github.com/jamespgrant3/step-functions-example). You will find a Cloud Formation template you can run to get started. I used cute little inline lambdas to avoid having to solve for deploying them. 😬

I wanted an example that had some flow, but also some parallelized tasks. The workflow ended up looking something like this:

![step functions working example graph inspector](/images/step-function-working-example-graph-inspector.png)

Basically, when the step function is executed, three concurrent requests are made. A request to:

- fetch the customer information
- fetch credit related account information, i.e. credit line
- fetch their credit score from the credit bureau

Once those requests succeed, a determination is made. A percentage increase is granted based on their fico score.

Parallelization is achieved by using a `Parallel` state. Each state just has one `Task`, a lambda, that gets executed. Take time to read the [state definition](https://github.com/jamespgrant3/step-functions-example/blob/ef69b024e0bf66237319937e9eb3fdbfe145a9fd/template.yml#L9). I really appreciate how well it reads, to basically anyone.

The `Parallel`'s task declares it's `Next` state as `CreditLimitIncrease`, which runs logic based on it's input.

I feel like this flow is obviously missing error handling, maybe I should slim down the parameters passed into each flow. Right now it receives the entire payload of the previous task. This makes it hard to test, because you have to know the structure of the input. Slimming inputs would make the payload more predictable...or...maybe...typescript could help here?

The current output of the state machine looks something like this:

```json
{
  "result": [
    {
      "customer": {
        "firstName": "James",
        "lastName": "Grant"
      }
    },
    {
      "credit": {
        "limit": 13165
      }
    },
    {
      "fico": {
        "score": 790
      }
    }
  ],
  "determination": {
    "isApproved": true,
    "percentageIncrease": 0.07,
    "oldLimit": 13165,
    "newLimit": 14086.55
  }
}
```

### lessons learned

#### iam

- the principal of state machine roles trust policy is `states.amazonaws.com`
- the state machine needs `lambda:InvokeFunction` permissions for any lambda it will invoke

#### cloud formation

- when you need to interpolate a value, like a lambda arn, use `DefinitionSubstitutions`, see [here](https://github.com/jamespgrant3/step-functions-example/blob/ef69b024e0bf66237319937e9eb3fdbfe145a9fd/template.yml#L61)
- you can inline lambda code for quick examples, by putting the code in `Properties.Code.ZipFile`, see [here](https://github.com/jamespgrant3/step-functions-example/blob/ef69b024e0bf66237319937e9eb3fdbfe145a9fd/template.yml#L104)
- [!GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) is shorthand for grabbing an attribute value in a template.

### next steps

I would like to get the state machine working locally, using [this](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html) cute little feature.
