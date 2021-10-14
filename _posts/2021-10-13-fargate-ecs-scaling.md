---
layout: post
title: fargate ecs scaling
tags: aws ecs fargate
---
A few months ago in a technical discussion, I was asked about scaling limitations of EFS Fargate. They got me, deer in headlights. Clearly, they knew I was an imposter before the discussion even began. I just couldn't think of anything.

I did know about ECS, fargate, and the recommended `awsvpc` networking mode. I just couldn't think of any scaling limitations. Fast-forward to last week, when I needed to attach a lambda to the ole vpc. I started researching downsides to scalability, why were lambda cold-starts such a big deal. Turns out, it's mostly attributed to an eni being allocated to the lambda.

I don't know what made me recall the fargate scalability question when I read this. It was either the fact that I knew an eni was allocated to an ecs task in awsvpc networking mode, or the emotional damage caused by **NOT** knowing the answer to the technical question. Anyway, I started digging deeper. Mainly because we are running several lambdas on the vpc, and we also have a couple fargate tasks running. I ran across [this](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html#vpc-limits-enis).

You are allowed 5,000 network interfaces per region. That is pretty generous, but definitely a limitation. As your workload evolves (new ec2 instances and lambdas) and utilization increases (scaling lambdas and/or ecs tasks) over time, this could contribute to a scaling issue.

## resources
[ecs quotas](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-quotas.html)
