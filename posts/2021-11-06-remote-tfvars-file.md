---
layout: post
title: remote tfvars file
tags: [aws, terraform]
date: '2021-11-06'
---
As we began building out features in our application it started to become necessary to have parameter store values that could **NOT** be committed to source control.

Until now, we had been adding values to the environment specific `terraform.tfvars` file and passing them into an `infra` module. Worked beautifully. Then secret'ish values started to creep in. How can we add values to parameter store without committing?

Solution: extract it somewhere. For us, that somewhere was s3.

We updated terraform to create a bucket in each environment, specifically for terraform configurations. Unforunately, for now, updating this file is a manual process. We did enable versioning on the bucket to prevent accidental deletion and to keep track of changes.

As far as the deployment goes though, we now have a build step that pulls down the `terraform.tfvars` using the s3 api. The build places the config in the appropriate place, and terraform does its thing.

I'm sure there's a better way? I really don't like the management process of this file: download, update, upload. I had a thought of a separate repo, that nobody has access to, where the tfvars file could be managed and deployed? If you have any thoughts or suggestions, please let me know.
