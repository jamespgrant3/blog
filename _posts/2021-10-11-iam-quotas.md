---
layout: post
title:  "iam quotas"
tags: aws iam
---
When initially setting up our deployment pipeline to deploy using `terraform`, I really wanted to follow best practice and employ the least privilege principle. So `terraform` only had permissions to do what it absolutely had to.

I quickly created a `deploy` role, and went to work attaching policies. In an effort to stay somewhat organized and appear to know what I was doing, I created a policy per resource. So when we created an aurora instance, I attached an `rds` policy with its permissions, load-balancer permissions were found in an `alb` policy.

This worked, until I added an 11th resource type, `terraform` threw an exception. It seems, `iam` roles can only have up to 10 policies attached....back to the drawing board.

Moving quickly, as we do, I decided to create a `deploy` policy and attach that little guy to the `deploy` role. Again, to look like I knew what I was doing, I grouped statements by resource type. It looked beautiful....until I wrote that 6,145th character. Turns out, policies are limited to 6,144 characters....back to the drawing board.

In fear of really getting figured out, I had to think of a solution quick. I needed a way to group policies at a higher level than resource type. This way, I could set permissions for several services in a policy and hopefully not hit the policy character limit. I thought about the console, and how AWS groups services. Take a look:

![aws console](/assets/images/console.png)

They almost have pillars, or categories of services. Pillars like `compute`, `storage`, `security_identity`. This could work? I'd be limited to 10 pillars, being I can only attach 10 policies to a role. This provided a longer term solution, and definitely helps take the guess work out of where permissions reside. Aurora permissions can only reside one place, a `database` policy.

As it stands, I have 7 policies attached to the `deploy` role. None of the policies are even close to meeting the character quota. More importantly, when I look at the remaining pillars, it doesn't look like we will be utilizing an of the services in those pillars. 🤞

You can find all the quotas related to iam [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html).
