---
layout: post
title: step functions, overview and cost
tags: aws step-functions
---
### step functions, overview and cost

I have been reading the step functions [docs](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) throughout the week, just trying to get a high-level overview, understand use-cases and costs.

### What is it
Step Functions is basically a serverless service that lets you orchestrate a workflow, using state machines and tasks. The workflow is a state machine, and the state machine is composed of tasks.

You define your state machine using [Amazon State Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html), which is nothing more than a json document. It is a map that defines the different states, and the tasks to execute for a given state. You can also provide decision trees to your state machine. So, based on a tasks output, your state machine can make a decision on which task to execute next.

### Cost
Step Functions have two different workflow types: `standard` and `express`.

#### Standard 
In this workflow, you are charged per state transition, and the duration of the request. The amounts vary by region. In US East you are looking to spend about $0.025 per 1k state transitions. The duration amount is rounded to the nearest 100ms, and the memory is billed in 64MB chunks. You also incur charges for any compute utilized during the task execution, i.e. lambda invocations.

The docs outline the cost calculation as:

`billable state transitions = total state transitions –
free tier state transitions`

The free tier allows you 4k free state transitions per month, and this limit **does not expire** after the 12 month term.

#### Express
In this workflow, you are charged for the number of requests and its duration. Again, duration is rounded to the nearest 100ms, and is billed per gb per second...with the memory billed in 64MB chunks. Duration calculations is basically

`billable duration = total execution duration (in seconds) /
the workflow memory utilized (50MB + state machine size) / 1024`

You get incentivized the more you use it, in that the GB/hr becomes bucketed. The first 1k GB/hr is billed at a certain rate, then the next 4k GB/hr is billed at a cheaper rate, and then additional GB/hr are billed at an even cheaper rate.

The duration billing in this workflow can get super confusing. I'd encourage you to look at the pricing examples [here](https://aws.amazon.com/step-functions/pricing). This page also shows the GB/hr charges per region.

### Differences
Some of the key differences in the workflow, aside from costs, that could drive your implementation:
- execution start rate: standard = 2k/sec, 100k/sec
- state transitions per second: standard = 4k/sec, express = unlimited
- max duration of a workflow: standard = 1 year, express = 5 minutes
