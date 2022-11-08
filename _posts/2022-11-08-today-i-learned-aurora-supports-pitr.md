---
layout: post
title: "today I learned: aurora supports pitr"
tags: aurora database
---
### today I learned: aurora supports point in time recovery out of the box
Aurora apparently writes log files to s3 constantly.

This allows you to restore to any point in time within your backup retention period. You can read more about it [here](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-pitr.html).
