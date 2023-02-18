---
title: dhcp
tags: [aws, vpc]
date: "2022-03-06"
---

We have a very brittle setup in our lower legacy environments, in that we have an ec2 instance that serves multiple purposes. Well, it used to. Now, it's essentially a nat gateway.

However, when it hiccups, entire lower environments go down...so ideally we want to get rid of it asap. Here is how it's set up.

Our docker swarm sits on a private subnet. It's route tables route `0.0.0.0/0` traffic to an eni attached to this ec2 instance. The instance sits in a public subnet and has a route table entry routing traffic to an internet gateway. There are even nat gateways already created...with routes to the same internet gateway.

**My plan**: stop the ec2 instance, and update all route tables that route `0.0.0.0/0` to the eni...over to the nat gateway. Then everything should just continue to work, UNLESS the ec2 instance is doing more than nat gateway things.

Well, we did that, and the lower environments still crashed. I double and triple checked all the route tables, ensuring all private subnets had a route to a nat gateway and that the subnets the nat gateway lived on had routes to the internet gateway. Everything looked beautiful.

Something had to be explicitly routing traffic to this ec2 instance. I couldn't find it, but my co-worker found that the `DHCP` options had a `domain-name-servers` entry explicitly routing traffic to the ec2 instance.

Unfortunately our window of opportunity ran out, so we couldn't make the change. We did create a new `DHCP` option, updating `domain-name-servers` to `AmazonProvidedDNS`. So, next time we make the same route table changes, update the vpc to use the new `DHCP` options set....and hopefully we can get rid of this craziness.

But this got me to thinking, what is [dhcp](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_DHCP_Options.html#AmazonDNS)? I do remember studying it briefly during my certification studies. dhcp stands for Dynamic Host Configuration Protocol. It's basically configuration information that's passed to ec2 instances when they are launched within your vpc. So, in our case, we were telling any ec2 instance to use a custom domain name server.

If you do not specify a `domain-name-servers`, aws defaults it to `AmazonProvidedDNS`. This maps to a DNS server running on `169.254.169.253`, and is basically a route 53 resolver server. `AmazonProvidedDNS` enables DNS for instances that need to communicate over a VPS's internet gateway.
