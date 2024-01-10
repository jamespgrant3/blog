---
title: "practice: observability (thread)"
tags: [aws, ecs, observability, deep-dive]
date: "2024-01-08"
---

This exercise will extend [this](/posts/practice-ecs-thread) ECS deep dive to include observability. I want to implement this using two providers: [Datadog](https://www.datadoghq.com/) and [New Relic](https://newrelic.com).

I think I am going to implement both of these in their own branches on [this](https://github.com/jamespgrant3/observability-practice) repo.

#### Update: 01-08-2024
I started exploring New Relic, and created a [newrelic](https://github.com/jamespgrant3/observability-practice/tree/newrelic) branch in my repo. You can read about their ECS integration [here](https://docs.newrelic.com/docs/infrastructure/elastic-container-service-integration/install-ecs-integration).

They have several integration types. Since I am already using CloudFormation, I am going to try to integrate their template into my existing template....hopefully that works? I haven't really looked it over, but that's my initial thought. I plan on looking it over some tonight and starting this work tomorrow morning.

#### Update: 01-09-2024
I ended up deploying the New Relic stack as-is. This deployed two nested stacks: *NewRelicInfraTaskStack* and *NewRelicECSTaskExecutionRoleStack*.

![stacks](/images/ecs/observability/stacks.png)

*NewRelicInfraTaskStack* contained a task definition. I ended up not using it. I updated my existing task definition and added the New Relic container to run as a sidecar.

*NewRelicECSTaskExecutionRoleStack* contained quite a few goodies...not just an execution role as the name suggests. The stack accepted the New Relic key as a parameter. The stack gave us:
- a secret, that contained the New Relic key
- a policy that contains read permissions to the secret
- an execution role, with this policy attached

I am just now realizing this, but, I literally only used the secret. I updated my existing execution role to allow for read access to the secret. If I did this all over again, I would not use the stack and just create the secret using my stack.

With this in place I deployed and saw both the sidecar container running and ECS metrics immediately appeared in New Relic.
![sidecar](/images/ecs/observability/containers.png)

![ecs metrics](/images/ecs/observability/metrics.png)

All the metrics work can be seen in [this](https://github.com/jamespgrant3/observability-practice/commit/fc1e2dd65f41355ee2e642c21b34f7013a46cd26) git commit.

But, there was no traceability, a little more configuration. It was actually really easy!

I had to:
- install the nodejs agent, `npm i newrelic`
- required this package within `app.module.ts`
- added the `NEW_RELIC_LICENSE_KEY` and `NEW_RELIC_APP_NAME` environment variables to both service containers
- modified how the application starts within the container

I instantly started seeing traces.

![trace](/images/ecs/observability/trace.png)

All the traceability work can be seen in [this](https://github.com/jamespgrant3/observability-practice/commit/ac99d9267b98938803b9885f5f8f034ccf5f2ab0) git commit.

I probably could have taken this further, but I learned a lot. Mainly around collecting traces, that the nodejs agent runs per-service. I was thrilled at how easy this was to set up, but wish there was a simpler solution. I have several agents running for instance, and I am not even forwarding logs. That's yet another...you guessed it...sidecar container. In the past I have run a fluentbit container to forward ECS logs to datadog.

I mean maybe this makes sense? We're bolting on solutions as we need them, rather than throwing the kitchen sink at each ECS service and only using a fraction of what we need.

#### Update: 01-10-2024
I am going to come back to the Datadog implementation. I want to dive into something new :)
