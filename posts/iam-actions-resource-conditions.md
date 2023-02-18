---
title: iam actions, resources, & conditions
tags: [aws, iam]
date: "2021-10-15"
---

This post started off as a paragraph, but I really wanted to illustrate one of my favorite iam resources and how I navigate it. I 💖 [this](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html) page. I literally use this hidden gem **every day**. I learned about this page by watching an [iam re:invent talk](https://www.youtube.com/watch?v=YQsK4MtsELU).

This page lists every aws service, and any iam actions possible for the service. It provides a table of all actions, resources, conditions, and even dependent actions.

#### Resource

Applying a resource to a policy specifies the object(s) that the statement covers. It essentially limits the scope of the permission, and is helpful in keeping to least privilege. One of the problems I have when writing policies, is knowing what my options are in this portion of the policy. This page fixes that. It lists the resource types for each action, and even provides possible arns that can go into the `Resource` section of the policy.

Let's create a policy that allows for querying the person table in dynamodb. If we navigate to the [dynamodb](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazondynamodb.html) portion of the the page, we can see all of the actions for dynamodb. A quick search for `query`, shows that there is a `Query` action. Based on this action, the resource types allowed are `table` and `index`. We want to query on table. So if you follow the table link, you are presented with example arns. For a `table` resource, the arn should be structured like so:

`arn:${Partition}:dynamodb:${Region}:${Account}:table/${TableName}`

So this policy should provide appropriate permissions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:Query"],
      "Resource": "arn:aws:dynamodb:*:*:table/person"
    }
  ]
}
```

#### Condition

The condition block lets you specify conditions for when a policy is in effect. Again, it's hard to know, per action, what your options are. This page does fall short. For conditions you have to do a little digging for the condition values.

Let's start by defining our policy. We want a policy that will allow users to start instances, but the policy only takes effect when a user launches a `nano` instance. Other instances will be implicitly denied.

If we navigate to the [ec2](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html) portion of the page, we can see all the actions for ec2. A search for `run`, shows that there is a `RunInstances` action. Based on this action there are many resource types allowed: `image`, `instance`, and `network interface` to name a few. Given our goal, we definitely want to apply a condition based on an instance. There are several conditions, but the `condition-key` that stands out is `ec2:InstanceType`.

Now we have to piece the condition together. Based on the [condition](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html) docs, the syntax is as follows:

`"Condition" : {"{condition-operator}": {"{condition-key}": "{condition-value}"}}`

Choose the best `condition-operator` for your policy based on the condition operator [docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html). We will use `StringLikeIfExists`. We have the `condition-key`: `ec2:InstanceType`. Now, how do we determine the condition value?

What I have found helps, is using the api reference docs for the service. So, for ec2, those docs can be found [here](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Welcome.html). I then search for the action (`RunInstances`) under the `Action` link....and generally the values can be found on the action page.

Given all of this, we can piece the following policy together:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:RunInstances"],
      "Resource": "*",
      "Condition": {
        "StringLikeIfExists": {
          "ec2:InstanceType": ["*.nano"]
        }
      }
    }
  ]
}
```

I know this was a long post, but this iam page is such a good one to bookmark and refer to. As I find difficult policies I will bump them up against the docs of this site as a test and to continue learning.

Happy IAMing
