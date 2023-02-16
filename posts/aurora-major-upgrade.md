---
layout: post
title: aurora major upgrade, 12.4 to 13.3
tags: [aurora, aws, postgres, rds]
date: "2021-10-12"
---

For the last few weeks I have been attempting to upgrade our lower environment `aurora` instances from Postgres 12.4 to 13.3. There's no dire need. I mainly just want to understand what a major aurora upgrade looks like, document, and plan accordingly. Our little glitter bombs currently run on `r5.large` instances.

Well, according to the [upgrade docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_UpgradeDBInstance.PostgreSQL.html), you just **DO** the upgrade. I would somewhat expect for it to be a simple process....it's aurora.

My first attempt was to just upgrade via the console, and I received the following error:
![upgrade error](/images/aurora-upgrade/error.png)

So I looked for pending maintenance actions:

```sh
aws rds describe-pending-maintenance-actions

# response:
{
    "PendingMaintenanceActions": []
}
```

I moved on, attempting to take a snapshot, and restore that snapshot to a new cluster with an instance running 13.3. Nope. The restore failed with an exception message stating the snapshot was created from a previous engine version.

With no direction, I did get it to work by doing a `pg_dump`, spinning up a new cluster, and restoring the `pg_dump`. While this would work for lower environments, this would never be a viable option for production.

A buddy and I timeboxed it today, and set out to find a solution. He quickly found [this](https://stackoverflow.com/a/69295017) stack overflow article. Through AWS Support, this article recommended upgrading the instance type. So we gave it a shot. I restored our snapshot to a precious little `r6g.large` instance, went to the console and upgraded the cluster to `13.3`, and saw <span class="money-green">money green</span> confirmation boxes appear in the console. IT WORKED!

How is this, or any upgrade related issues, not documented in the upgrade docs!? Anyway, it's good to know that while there is downtime involved...it is an easy process.

### Cluster Events

![cluster events](/images/aurora-upgrade/cluster-events.png)

### Instance Events

![instance events](/images/aurora-upgrade/instance-events.png)
