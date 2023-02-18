---
title: "today I learned about: aws local zones"
tags: [aws, compute, local-zones]
date: "2021-11-08"
---

Today I was listening to [this](https://aws.amazon.com/podcasts/482-introducing-aws-local-zones/) aws podcast. The concept of local zones interested me, so I decided to dig a tiny bit deeper.

An aws local zone is compute on the edge. It’s basically a region that sits really close to the end-user. Because it’s so close, you get a close entrypoint into the aws network and get to capitalize on the aws backbone.

The podcast talks about a company that was migrating onto the cloud, and latency was a really big deal. They were able to migrate their app service by service. They mentioned that migrated code onto the cloud was making database calls at 48ms. Apparently this was unacceptable, and through local zones they were able to lower the call to just ~2ms!!

Different zones support different services. You can see a list of services per zone [here](https://aws.amazon.com/about-aws/global-infrastructure/localzones/features/#AWS_Services)

To use a local zone, it must be enabled in the console:

![enable local zone](/images/enable-local-zone.png)

Next, you launch resources into it by specifying a subnet within the zone. That’s it.

This definitely isn’t a need for my specific workload, but as a cloud architect I feel it’s important to have a general understanding of aws offerings.

Official aws docs can be found [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-local-zones).
