---
layout: post
title: cross-account dns 
tags: aws r53
---
### cross-account dns 
To many, this is probably stating the obvious, but initially it wasn't to me.

I have been working hard to re-platform our products infrastructure at work. In lower environments, we just registered a new domain name. This has worked great. However, in prod, we must preserve our product URL. How can we do this? Our domain is registered in one AWS account, and our site and api calls are in another. But....until we've migrated everything over, we also have endpoints in our legacy aws account that we must be able to communicate with.

Solution, dns and hosted zones.

The POC that I started, creates a hosted zone in the new AWS account, using our domain name. I updated the name servers attached to the domain name to be that of the hosted zone in the new AWS account. I was also able to issue SSL certs in the new account. Luckily for us, every resource in the legacy account is a public ELB.

So, we should be able to migrate all the R53 dns entries that exist in the legacy account, to the new account, and things should just work.

As an added bonus, all these migrated DNS entries can now be managed by terraform.
