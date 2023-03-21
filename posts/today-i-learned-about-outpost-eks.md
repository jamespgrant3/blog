---
title: "today I learned: outpost, eks on outpost"
tags: [aws, eks, outpost]
date: "2023-03-20"
---

Today I had an extremely productive podcast listening session, during a 6-mile walk. I learned a few things.

First, I was listening to this [day two cloud](https://daytwocloud.io/podcast/day-two-cloud-180-understanding-aws-ec2-at-the-edge/) podcast.

I learned that [outpost](https://aws.amazon.com/outposts) is a service where a customer can basically order a server rack and run it on-prem. The customer configures their workload, designating: compute (EC2, EKS, ECS), storage (EBS, S3), and database. The rack comes, the customer plugs it in, and it's immediately registered with AWS and appears as a region. In fact, they even talk about how local zones are merely outpost racks. I thought that was an interesting re-use of infrastructure.

They also made mention of how the outpost team wanted the ability to host eks on the outpost rack. I found a release post about it [here](https://aws.amazon.com/blogs/aws/deploy-your-amazon-eks-clusters-locally-on-aws-outposts). This feature allows you to host nodes, and the control plane, on the outpost rack ensuring the workload stays operational in the event of a failure.
