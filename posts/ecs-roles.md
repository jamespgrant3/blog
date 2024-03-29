---
title: ecs roles
tags: [aws, ecs]
date: "2021-10-22"
---

Have you ever been working with an ecs task and wondered, what is the difference between the execution role, and the task role?

In my case, I am using a publicly available image, and have only attached a task role to the task. Well, this week, I wanted to attach my cli to a container, and instantly ran into issues. This is when I was forced to learn the difference between the two.

As for the execution role, I instantly drew a comparison to a lambda execution role. This role gives the function permissions to make aws api calls on your behalf. Well, a task execution role is the exact same thing. It gives the ecs container, and Fargate agents, permissions to do things. Common use cases are permissions for pulling container images, sending container logs to cloudwatch, pulling parameter store or secrets manager to be used by the task definition.

The task role is a role that is used by containers within the task. This is where you define permissions for services to support application code, access to: sqs, application-level parameter store values, lambda invocations, etc.

I think for me, the easiest way to remember the difference is to think about the execution role as that. When a task executes, or fires up, what permissions will it need? Clearly it needs authorization to pull the container image, and satisfy any prerequisites for the task definition. The actual task role is a role that containers within the task utilize, to support a business need.

In the end, to allow container access, I had to attach a task role to allow my cli container-level access. There were several other changes to get this working, which I will cover in a separate blog post :)
