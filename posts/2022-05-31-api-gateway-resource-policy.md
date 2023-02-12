---
layout: post
title: api-gateway resource policy
tags: [api-gateway]
date: '2022-05-31'
---
I recently had a request to only allow an endpoint on our api-gateway to be called from a certain subset of ip addresses. After a little research, I found out it is possible using a resource based policy on the api-gateway.

You can even filter down to the http verb/resource path. The api-gateway resource arn format looks something like this:

`arn:${Partition}:execute-api:${Region}:${Account}:${ApiId}/${Stage}/${Method}/${ApiSpecificResourcePath}`

So an example policy would look like this:

```terraform
data "aws_iam_policy_document" "my_rest_api" {
  # allow everyone to access all the endpoints
  statement {
    actions = [
      "execute-api:Invoke"
    ]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    resources = ["arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.my_api.id}/*/*/*"]
  }

  # allow certain ip's access to the user endpoints
  statement {
    effect = "Deny"
    actions = [
      "execute-api:Invoke"
    ]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    resources = [
      "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.my_api.id}/*/*/api/users/*"
    ]
    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values = flatten([
        local.cidr.some_ips,
        local.cidr.other_ips,
        local.cidr.ip_sec_ips
      ])
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "my_api" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  policy = data.aws_iam_policy_document.my_rest_api.json
}

resource "aws_api_gateway_rest_api" "my_api" {
  endpoint_configuration {
    types = ["EDGE"]
  }
  name = "my-api"
}
```

Here we explicitly `ALLOW`, `/*/*/*`. This allows all traffic to every stage and http verb to flow through. Then, we apply an explicit `DENY` statement to the `/api/users/*` endpoint, on all verbs and stages...EXCEPT in the three arrays of cidr block we defined in our `locals`.

Very simple, IAM for the win.
