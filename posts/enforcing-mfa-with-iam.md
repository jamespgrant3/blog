---
title: enforcing mfa with iam
tags: [aws, iam, mfa]
date: "2021-11-04"
---

Soon, we will begin moving our infrastructure up the chain in environments. As part of this process, I am making decisions around infrastructure hardening. One of which, is enabling MFA across all aws accounts.

The way we have our aws accounts setup, is something like this. We have what I call a "legacy" aws account. This account is what we're trying to move away from. It hosts all infrastructure for every environment. Over the years, as with a lot of companies, it's grown into a bit of a mess. So, we designated this account as the "root" account and quickly setup [aws organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html).

I didn't, and actually couldn't, use this legacy aws account for user administration because it was already being used. The first thing we did was designate one aws account as the "administration" account. This account **ONLY** contains users, that's it. Everyone logs into this account, and assumes roles over into the other accounts.

We use groups to manage who can login to what aws environments. By assigning a user to the `dev` group, they are authorized to assume the appropriate role into the child account.

Enforcing MFA became really easy. I created an `mfa` policy, largely influenced by [this](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html) page. I then, attached that policy to all the user groups. This policy does the following:

- enables users to manage the MFA devices for their person
- denies all actions except MFA'ish things when MFA is not present

As an added touch of security, I updated the trust policies on the roles in the child accounts to include a `Condition` to enforce MFA as well. The trust policy could look something like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<parent-account-id>:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```

With just a few easy steps, we now have MFA enabled on all of our AWS environments.
