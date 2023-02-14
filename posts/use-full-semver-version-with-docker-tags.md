---
layout: post
title: "note to self: use full semver version with docker tags"
tags: [docker, ecs]
date: '2022-12-14'
---
Yesterday, I encountered a really difficult issue I had to resolve. Our hasura ECS tasks were failing in only two environments, one of which was `prod`. These tasks are deployed using Terraform. So, why only these two environments, and why now?

The tasks would initially start, once the first request came in, they would fail and deregister from the load balancer. This quickly caused us to get [rate limited](https://docs.docker.com/docker-hub/download-rate-limit) by docker hub. Because these images are public, I was making unauthenticated requests to docker hub. Docker hub allows 100 pull requests every 6 hours. If you do authenticated requests, that limit increases to 200. To get the environment operational, I started hacking away in the console in a lower environment. I quickly switched over to authenticated requests, we did not have hours to wait.

Initial troubleshooting indicated nothing in the Datadog logs, of course. There were no signs of memory or cpu utilization issues. But, as a precaution I increased these values to truly rule it out. The tasks still failed. The task initially registered to the load balancer, so I knew it was something inside that task failing.

The task consisted of two containers: hasura graphql engine, and fluentbit. fluentbit is a sidecar container we use to ship the ECS logs to Datadog. My first thought was to eliminate fluentbit from the picture. I updated the task to ship logs to Cloud Watch. The first request came in, and it didn't fail!!! To prove I was not insane, I redeployed Terraform to resolve all the drift, and it failed again. So, I wasn't crazy...we definitely found the culprit.

I went to docker hub and discovered that fluentbit pushed a container 2 weeks ago, `1.9.10`. This is why all the other environments were not failing. Their ECS tasks had been running for 30+ days. The two affected environments recently had their secrets rotated, so the tasks were restarted and they received the most recent version of fluentbit.

In looking at our task definition, we were pulling the fluentbit container like so: `fluent/fluent-bit:1.9`. My thinking, this was equivalent to `1.9.0`. No, this is equivalent to `1.9.x`. `x` being the latest patch version, which in this case was `1.9.10`, the broken version.

`1.9.9` was pushed to docker hub months ago, this is definitely the version the working environments are running. I updated our task definition to pull: `fluent/fluent-bit:1.9.9` and we were back in business!!

As part of my own curiosity, I did a little digging. Their [release notes](https://github.com/fluent/fluent-bit/releases/tag/v1.9.10) for `1.9.10` indicate no image was pushed?? I am probably the only fool referencing `1.9`, but given this image wasn't supposed to be pushed, I created an [issue](https://github.com/fluent/fluent-bit/issues/6555) to raise awareness.

Lessons Learned:
- be very intentional, use the entire version for any docker tag
- probably a best practice to use authenticated requests to docker hub
- even better, consider pushing vendor images to ECR. Their rate limit is 2,000 requests per second per region, see [here](https://docs.aws.amazon.com/AmazonECR/latest/userguide/service-quotas.html)
