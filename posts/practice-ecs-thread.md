---
title: "practice: ecs (thread)"
tags: [aws, ecs, deep-dive]
date: "2023-02-21"
---

I have been given some thought on what deep dive to take next. Given that I have two containers ready to go, why not try to implement the same setup in ECS? So that's the plan. Attempt to have two ECS tasks communicate, with only one exposed to the world. Ideally using some type of service discovery.
