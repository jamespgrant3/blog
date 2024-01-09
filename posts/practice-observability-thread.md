---
title: "practice: observability (thread)"
tags: [aws, ecs, observability, deep-dive]
date: "2024-01-08"
---

This exercise will extend [this](/posts/practice-ecs-thread) ECS deep dive to include observability. I want to implement this using two providers: [Datadog](https://www.datadoghq.com/) and [New Relic](https://newrelic.com).

I think I am going to implement both of these in their own branches on [this](https://github.com/jamespgrant3/observability-practice) repo.

#### Update: 01-08-2024
I started exploring New Relic, and created a [newrelic](https://github.com/jamespgrant3/observability-practice/tree/newrelic) branch in my repo. You can read about their ECS integration [here](https://docs.newrelic.com/docs/infrastructure/elastic-container-service-integration/install-ecs-integration).

The have several integration types. Since I am already using CloudFormation, I am going to try to integrate their template into my existing template....hopefully that works? I haven't really looked it over, but that's my initial thought. I plan on looking it over some tonight and starting this work tomorrow morning.
