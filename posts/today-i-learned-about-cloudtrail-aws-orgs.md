---
layout: post
title: "today I learned: cloudtrail and aws organizations"
tags: [aws, cloudtrail, organizations]
date: "2023-02-02"
---

I did not know this. If you are using aws organizations, you can create a trail on the root account and designate it as being an organization trail.
When you do this, the trail will replicate to each member account within the organization.
You can even designate the trail to be multi-region, and the trail will be replicated in other regions.

There is a potential costly downside.
You will be charged for a second copy of an event if you create a second trail in a member account, or in another region in a multi-region trail, and capture the same events as the organization-level trail.

This is great to know, hope it helps you. You can read more [here](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trail-manage-costs.html).
