---
title: "today I learned about: remote terraform modules"
tags: [aws, container, terraform]
date: "2024-01-23"
---

I started a new job and am learning so much. I didn't realize that when referencing a module, it can be from a remote source, like a git repository. In fact it can be from other places, like s3 buckets. For a complete list see [here](https://developer.hashicorp.com/terraform/language/modules/sources).

For my learning though, this module was referencing another repository in bitbucket. So in this case, we have a reusable VPC module. The example below will pull in the module, over ssh. Such an approach could help segment out modules. So maybe you have some enterprise team that sets the standards for the VPC configuration. You could isolate the development of this module into a repo, and make it available to others.

```
module "vpc" {
  source = git:ssh://git@bitbucket.org/<org>/<repo>.git
}
```
So what about potentially breaking changes? You can provide a branch!!! So in this example, we're pulling the same module, but referencing a version....or branch: `v1.2.3`. Now, things could still break. Ideally releases would be managed and immutable.

```
module "vpc" {
  source = git:ssh://git@bitbucket.org/<org>/<repo>.git?ref=v1.2.3
}
```
