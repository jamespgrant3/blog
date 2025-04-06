---
title: "kms grants"
tags: [kms, aws]
date: "2024-02-25"
---

Anytime I have granted permissions to a KMS key, I either did so using an IAM policy or the key policy itself.

I recently stumbled on the ability to create a kms grant. This operation is done through the cli, and looks something like this:

```
aws kms create-grant \
  --key-id 1234abcd-12ab-34cd-56ef-1234567890ab \
  --grantee-principal arn:aws:iam::111122223333:role/keyUserRole \
  --operations Decrypt
```

This statement creates a grant on a key, and allows the principal to conduct the specified operation.

Grants have many operations that can be assigned. You can even create grants that allow principals to manage a grant.

This is just a quick post for awareness. I thought it was a pretty cool way to abstract kms permissions. I wish the console gave you a view into the grants. It looks like the api for grants is only accessible through the cli?

You can read more about this feature in the [aws docs](https://docs.aws.amazon.com/kms/latest/developerguide/grants.html).
