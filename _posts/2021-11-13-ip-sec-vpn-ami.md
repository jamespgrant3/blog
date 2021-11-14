---
layout: post
title: ip-sec-vpn ami
tags: ami aws security
---
### ip-sec-vpn ami
We allow developers to connect to resources in private subnets using an [ipsec-vpn-server](https://hub.docker.com/r/hwdsl2/ipsec-vpn-server), i.e., bastion host.

This is a container that provisions users and runs on a public ec2 instance. We allow the security group attached to the ec2 instance access to explicit ports on certain private resources.

As you can imagine, now that we are multi-environment, this can be a tedious process as we spin up new environments. To help alleviate some of the setup, I created an `ami` that has much of this config baked-in.

We have one aws account that was designated the "administration" account. It's sole purpose is for user administration. That's it. To me, it's a common area. You have to login to this account, in order to assume roles into all the other accounts. So, I chose to create the `ami` in this account. So it's created and maintained in one place.

Then, when we spin up an environment, I [share the ami](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-explicit.html) across accounts.

Ideally the next step is to automate this using terraform, so that we don't have to manually spin up the instance. The sharing of the `ami` would always be a manual process...maybe?

But, we cut down the steps drastically. We simply:
- share the ami
- start the ami on an ec2 instance
- and provide a specific security group

That's it! Simpler, but not 100% automated 😭
