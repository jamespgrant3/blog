---
layout: post
title: "today I learned about: finding cloudwatch events/metrics"
tags: aws cloudwatch
---
### today I learned about: finding cloudwatch events/metrics
As a cloud architect, I am learning that it's critical to know your way around the aws docs.

I have on several occasions, found myself wondering what Events/Metrics different services send or capture. How can I know what those events are, understand what they are and why they're sent?

Well today I found another gem, kind of like the [IAM gem]({% post_url 2021-10-15-iam-actions-resource-conditions %}) I posted about. [This](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) page shows each service, and a link to their metrics. This is what I have been looking for.

You can also, I learned, use the User/Developer Guide, under each service. There is generally a `Monitoring` section. Within that section AWS outlines really well, what events the service sends.

Some Examples:
- [ec2 metrics](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)
- [ecs events](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwe_events.html)
- [ecs metrics](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/viewing_cloudwatch_metrics.html)
