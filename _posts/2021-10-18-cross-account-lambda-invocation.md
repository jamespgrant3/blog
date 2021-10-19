---
layout: post
title: cross account lambda invocation
tags: aws lambda
---
I've known that you can invoke lambdas cross-account, but I have never actually implemented one, until this week. It's really easy. In this example, `account-a` will be the account that owns the lambda, and `account-b` will be the account calling the lambda.

Lambdas allow for resource policies to be attached. I attached a resource policy specifying that a specific principal (role) from `account-b`, could `InvokeFunction` on a specific lambda, like this:
```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::<account-b-id>:role/my-role"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:us-east-1:<account-a-id>:function:my-function"
}
```

Next, on the invoking function's execution role, I attached a policy that allowed for `InvokeFunction` on the lambda in `account-a`.
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "lambda:InvokeFunction"
    ],
    "Resource": "arn:aws:lambda:us-east-1:<account-a-id>:function:my-function"
  }]
}
```

Finally, I just used the aws js sdk's [invoke](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property) method, passing in the function's arn as the `FunctionName`. I got a beautiful `200` back.

There is a separate permission, `lambda:InvokeAsync`, that will need to be attached to both policies if the lambda is to be invoked asynchronously.

We are in the process of replatforming a product, so our specific use-case for this functionality is to incrementally migrate data from a legacy aws account to the account hosting the new replatformed version of the product.

As you can see, cross-account lambdas are really easy to setup. This could not have been any easier.
