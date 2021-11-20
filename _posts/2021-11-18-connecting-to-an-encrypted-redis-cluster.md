---
layout: post
title: connecting to an encrypted redis cluster
tags: aws elasticache redis
---
### connecting to an encrypted redis cluster
I recently had the privilege of being tasked with setting up a redis cluster. Super easy. But, I also needed to ensure that we could connect to the cluster so that if anything went wrong, we could troubleshoot.

This post is my thought process and the solutions I tried to resolve the matter...so it's a bit winded.

**tl;dr**: redis-cli does not support tls out of the box. Support requires a compilation step with the `BUILD_TLS` flag set. Consider creating a docker image with the compilation built in. When you execute the redis-cli command using the image, supply the `--tls` parameter to docker.

As part of my setup, I enabled encryption both at rest and transit. Terraform did the entire deployment beautifully. Now, for connecting locally.

We had proven this out from a security perspective when setting up our Aurora instance. I have a vpn security group that allows traffic into certain ports from IP's from our vpn provider. Once connected, you can then connect to the ip-sec-vpn/bastion host. This connectivity gives you access to private resources. Nothing special.

I had to add an inbound rule to the security group attached to the elasticache/redis cluster, that allowed traffic from this vpn security group. Easy.

Next question, how can I connect to the redis cluster? I started looking for ui-based tools, but there wasn't much there. I use [TablePlus](https://tableplus.com/) to connect to all the data sources. It allows me to connect, but I can't do much with the redis cluster after that. It's a read-only view. I also wanted a solution that didn't impose a UI to the team. The only real option that I saw was the [redis-cli](https://redis.io/topics/rediscli).

redis-cli required an install of the redis server, which I wasn't a fan of. Developers might be, though, for local development? So it is an option, but I also wanted a more light-weight option. So, I opted for the cute little [redis container](https://hub.docker.com/_/redis). So, I tried running the redis-cli within the container:

```sh
docker run redis redis-cli -h <my-cluser-primary-endpoint> -p 6379
```

It **WOULD NOT** connect!! It just hung...which instantly made me think it was security group related. So, I temporarily opened the redis security group to the world. All ports from everywhere....same thing.

I thought maybe it was a network issue within the docker container? I tried running a few different ways, altering the `--network`, no luck. I `exec`'d into the container and installed curl...and was able to make calls to google.com. Didn't seem to be docker.

I then said screw it, and installed redis on my machine. When I ran redis-cli....it just hung. SO, it definitely wasn't docker. Uninstall!

After some research, I learned about [tls support](https://redis.io/topics/encryption) with the redis container. It's only supported through a flag during the compilation step. Now, I remembered seeing this `BUILD_TLS` flag in the [aws docs](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/GettingStarted.ConnectToCacheNode.html#Download-and-install-redis-cli) that I just glanced over. Long story short, the solution was in front of my face, I just refused to recognize it...for whatever reason.

Those instructions are for installing the redis-cli on a Linux-based ec2 instance, again...I wanted to use docker. So, I quickly found that aws maintains a [linux](https://hub.docker.com/_/amazonlinux) image. I took the instructions from the aws docs, above, and started building my custom image with the redis-cli. I had to make a few minor tweaks, but ended up with this:

```sh
FROM amazonlinux
MAINTAINER James Grant

RUN yum install gcc gzip jemalloc-devel make openssl-devel tar tcl tcl-devel clang wget -y
RUN wget http://download.redis.io/redis-stable.tar.gz 
RUN tar xvzf redis-stable.tar.gz
WORKDIR redis-stable
RUN CC=clang make BUILD_TLS=yes
ENV PATH "$PATH:src"
```

After building the image, I ran:
```sh
docker run my-redis redis-cli -h <my-cluser-primary-endpoint> -p 6379
```

Again, wouldn't connect. Just because you build with tls enabled, doesn't mean it uses it when connecting. So I ran:

```sh
docker run my-redis redis-cli -h <my-cluser-primary-endpoint> -p 6379 --tls
```

**It connected.** There are no words to describe the feeling I felt when I saw the redis-cli prompt.

The connectivity was a small step within the task, and a very time consuming step. But, it's things like this that drive me crazy until I work through and learn the solution. And, it's times like this that I enjoy the most about tech. Not quitting...until the problem is solved...and the satisfaction that comes as a result of the hard work.

I ended up building a docker image that developers can use, and I pushed the Dockerfile into our repo so that we have it as a reference and can maintain it.

In the end, we had to disable encryption in transit 🤣, because the tool we're using didn't support calling redis over tls. So, all of this was just a learning experience. The biggest takeaway for me was the fact that I could have saved a lot of time by really reading the aws docs, and understanding that in order to make encrypted calls to redis, I had to follow the instructions. It took all the digging to understand the why.
