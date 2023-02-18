---
title: terraform multi-account deployment strategy
tags: [aws, terraform]
date: "2021-10-27"
---

Our multi-account strategy was influenced by [this](https://www.terraform.io/docs/language/settings/backends/s3.html#multi-account-aws-architecture) terraform doc.

Before taking my current role, I had been reading about how multi-account is a best practice for separating out your workloads per environment. Some even suggest per service, sounded a little extreme to me?

I chose terraform as the means to deploy infrastructure. This choice was mainly because I was somewhat familiar with it, the community behind it, and given how much I was about to learn I wanted the IaC portion to not require too much thought.

If you didn't know, terraform stores infrastructure state in state files, and will store sensitive data as plain text within these state files. So, it's critical that state files be inaccessible to others. Terraform provides many backends to store these state files, so I chose s3. We saw there were really two groupings of environments: prod, and everything else...non-prod. So, we adopted a hub-spoke approach. We have two hubs, which consists of two isolated aws accounts: prod and non-prod.

These hubs only have two purposes: store state files in s3, and create a `deploy` user for deployments....that's it. A non-prod hub s3 bucket might look like this:

```
  dev
    /infra
      terraform.tfstate
  qa
    /infra
      terraform.tfstate
```

The s3 bucket is private, and nobody ever gets access to these hub aws accounts. This makes it easy to manage permissions around the bucket. The `deploy` user in the hub is given read/write access to the s3 bucket.

The spoke accounts are also separate aws accounts, and have several responsibilities:

- create a deploy role
- define permissions for that role
- define infrastructure that is deployed within the environment

The spoke `deploy` role enforces least privilege and gives terraform only the permissions needed to deploy infrastructure. So each spoke is responsible for what can be deployed to its environment. The trust policy of this role was specifically set to the `deploy` user of the hub account. So it's very intentional that only the hub user can ever assume this role.

Our `main.tf` file looks something like this:

```terraform
terraform {
  backend "s3" {}
}

provider "aws" {
  allowed_account_ids = [
    var.account_id
  ]
  assume_role {
    role_arn = var.terraform_role_arn
  }
  region  = var.region
}

module "infra" {
  # code here
}
```

In the `terraform.tfvars` file we set the role that is to be assumed, along with the account id for added protection, and terraform does the rest.

Until now, I was so used to deploying to the environment that you're in. It really blew my mind that you can assume a role into another aws account and deploy infrastructure there as someone else.
