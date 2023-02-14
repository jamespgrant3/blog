---
layout: post
title: "private api gateway"
tags: [aws, api-gateway]
date: '2023-01-27'
---
This week, we worked to migrate a critical service within our application. Currently, this service is served as a container within our Docker swarm. However, we migrated it to run within a Lambda. It is really important that this service remains private in production. However, developers like for it to be public in lower environments, for debugging.

I did some research. I saw documentation basically stating to lock down the gateway like this. You create a vpc endpoint to keep all the traffic internal to the vpc, and you also update the api-gateway's resource policy to only allow traffic from only the vpc endpoint. This makes complete sense.

Currently, we have one api-gateway that we attach every lambda to. My initial thinking was, I will just attach to that. I saw that you can restrict api gateway calls at the route level. So, we'll mix and match. Have some endpoints public, some private. So the resource policy statements looked something like this:

```sh
{
  "Sid": "AllowAllTraffic"
  "Effect": "Allow",
  "Principal": { "AWS": "*" },
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:us-east-1:12345:abc123/*/*/*"
},
{
  "Sid": "DenyTrafficToSecurityEndpoint"
  "Effect": "Deny",
  "Principal": { "AWS": "*" },
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:us-east-1:12345:abc123/*/*/security/*"
  "Condition": {
    "StringNotEquals": {
      "aws:sourceVpce": "vpce-06ab",
      "aws:sourceVpc": "vpc-0d89"
    }
  }
},
{
  "Sid": "AllowVpcTrafficToSecurityEndpoint",
  "Effect": "Allow",
  "Principal": { "AWS": "*" },
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:us-east-1:12345:abc123/*/*/security/*",
  "Condition": {
    "StringEquals": {
      "aws:sourceVpce": "vpce-06ab",
      "aws:sourceVpc": "vpc-0d89"
    }
  }
}
```
As you can see, the first statement allows all traffic, the second conditionally puts an explicit deny on the security endpoint when the traffic does not originate from the vpc, and the final statement conditionally puts an allow on the security endpoint when the traffic does originate from within the vpc.

Once you create the vpc endpoint, you access the gateway through the following url: `https://{rest-api-id}-{vpce-id}.execute-api.{region}.amazonaws.com/{stage}`. I could not get this to work. The deny should only be applied when the traffic is external, and the allow should only be applied with the traffic is internal.

I did more research and found [this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api#vpc_endpoint_ids) little nugget. Vpc endpoints have to be associated to the api-gateway, and this association can only be done on a private api-gateway. I mean, think about it. This makes complete sense. Why would you ever mix the two? Why would you rely on a resouce policy to lock down a private api!? If that resource policy ever were to be removed, your api is exposed.

So, we should rely on infrastructure to create that isolation.

We now have two api-gateways. One for public, application services. The other for private endpoints. I do have a resource policy on the private api-gateway, but only to explicitly allow traffic from the vpc endpoint. All other traffic will be implicitly denied.

```sh
{
  "Sid": "AllowVpcEndpointTraffic",
  "Effect": "Allow",
  "Principal": { "AWS": "*" },
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:us-east-1:67890:def456/*/*/*",
  "Condition": {
    "StringEquals": {
      "aws:sourceVpce": "vpce-06ab",
      "aws:sourceVpc": "vpc-0d89"
    }
  }
}
```
Accessing the endpoint using the url above, worked beautifully. I can not stand ugly urls, and luckily route53 supports `A` records with an alias to the vpc endpoint, so I am currently cleaning this us.

To solve being able to access this private api-gateway in lower environments, I updated the resource policy. I added a statement that allows connectivity from our ip-sec vpn servers. These are servers that our developers connect to to gain access to private resources. So the solution fits right in with their everday workflow.

```sh
{
  "Sid": "AllowIPSecAccessToVpcEndpoint",
  "Effect": "Allow",
  "Principal": { "AWS": "*" },
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:us-east-1:67890:def456/*/*/*",
  "Condition": {
    "IpAddress": {
      "aws:SourceIp": "11.222.333.444"
    }
  }
}
```

As added protection, the vpc endpoint has a security group attached to it. I configured it to only allow tcp traffic on port 443, from our vpc's cidr.

Of course, the solution is terraformed so all of the arns and ip's get updated as we promote this up the environments.
