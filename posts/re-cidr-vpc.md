---
layout: post
title: re-cidr a vpc
tags: [aws, vpc]
date: '2022-02-27'
---
My initial task at my current employer was to create a more manageable and scalable infrastructure for our product to run on. As I have mentioned several times, we chose terraform as our IaC solution.

The effort for the re-infrastructure was built into a large feature. We wanted to go multi-account and this feature was to have its own database. We were going to combine the two worlds at a later time. Fast forward, and now we're starting this migration process to combine the two databases.

However, we are only migrating the database. After the migration, there will still be parts of the workload in the old aws account that need to communicate with the database in the new environment. Enter [vpc peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html).

Here is the problem, our legacy aws account houses every environment: `dev`, `demo`, `qa`, `prod`, etc. So, this one legacy account will be peered with each of the new aws accounts. The vpc cidr in terraform is set in stone, and we've now deployed this up the stack...all the way to `prod`. So every vpc contains the same cidr. When you peer vpc's, you have to update the routing tables in each vpc, so that they can direct traffic to and from each other. Well, when we go to update the route tables in the legacy account, how do we send traffic back to the appropriate vpc if they all have the same cidr? As a matter of fact, what is the [first rule](https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html) with peering? **NO OVERLAPPING CIDR BLOCKS**. Kill. me. I mean, I knew this. I just didn't think about it. I was focused on re-infrastructure.

The actual fix is easy, push the cidr declaration back into the tfvars for each env. BUT, when you go to deploy, terraform is unaware of your intent. It wants to re-cidr, but can't because you may have unchanged resources that sit on the subnet. Like, in our case, a database, ecs tasks, a redis cluster, lambdas attached to the vpc. So, terraform hangs because nothing changed on those resources and they are still attached to the subnets that need to be destroyed.

This work has not been done yet, it's scheduled to be released in a couple of weeks. The plan, it will be a very manual deployment. After I kill the redis cluster, stop the ecs tasks, delete all cloudformation stacks to remove vpc-attached lambdas, terminate the bastion host, and snapshot/kill the database...**THEN**, once all of the network interfaces have been released, I can run terraform apply providing the snapshot id.

This has been thoroughly tested in several environments. It's just a tedious task. As anyone would, I question where I went wrong. I knew the databases would be migrated. Maybe it was a product of being new to the job? I was taking on a new role/career, trying to hit the ground running? I didn't know much about the legacy infrastructure either. I just knew it was there. Anyway, it's fixed, long-term. It will bring me joy to remove the peering one day in the future.
