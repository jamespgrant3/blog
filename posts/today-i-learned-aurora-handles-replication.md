---
layout: post
title: "today I learned: aurora handles replication"
tags: [aurora, aws, terraform]
date: "2021-11-05"
---

As part of my cute little production readiness chores, I want to enable replication. While reading through [this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_instance) terraform document, I saw this:

> Unlike other RDS resources that support replication, with Amazon Aurora you do not designate a primary and subsequent replicas. Instead, you simply add RDS Instances and Aurora manages the replication.

Now this hasn't been tested, but based on documentation it's as easy as:

```terraform
resource "aws_rds_cluster_instance" "cluster_instances" {
  count              = 2
  identifier         = "aurora-cluster-demo-${count.index}"
  cluster_identifier = aws_rds_cluster.default.id
  instance_class     = "db.r5g.large"
  engine             = aws_rds_cluster.default.engine
  engine_version     = aws_rds_cluster.default.engine_version
}
```

I was hoping for cross-region, but based on their [replication docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html),
it appears aws doesn't support it.

> An Aurora DB cluster can contain up to 15 Aurora Replicas. The Aurora Replicas can be distributed across the Availability Zones that a DB cluster spans within an AWS Region.
