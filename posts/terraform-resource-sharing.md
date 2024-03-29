---
title: terraform resource sharing
tags: [api-gateway, aws, serverless-framework, terraform]
date: "2021-10-10"
---

As part of a replatforming effort, I was recently tasked with exposing a bunch of lambdas to the world. The obvious solution was an `api-gateway`. In looking at how this was achieved in the current architecture: a serverless stack was created, a bunch of lambdas were attached, and the serverless stack was deployed.

What may not be too obvious here, is that if you don't specify an `apiGateway` in your serverless framework config file, the framework will create an `api-gateway` for you. So over time you could potentially end up with a handful of gateways, each of which have its endpoint hardcoded in a config file somewhere. 🤢

We made the decision that the `serverless framework` would be responsible for deploying lambdas, and `terraform` would be responsible for deploying everything else. With this in mind, I really wanted one clean `api-gateway`, that both `terraform` and `serverless` could attach routes to. Here is how we solved the problem.

Create the ole `api-gateway`:
{% highlight terraform %}
resource "aws_api_gateway_rest_api" "my_gateway" {
endpoint_configuration {
types = ["EDGE"]
}
name = "my-gateway"
}

# more configuration here

{% endhighlight %}

Next, based on the [serverless.yml](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml#serverlessyml-reference) docs, you can attach to an existing `api-gateway` by supplying a `restApiId` and a `restApiRootResourceId`:

{% highlight yaml %}
apiGateway: # Optional API Gateway global config
restApiId: xxxxxxxxxx # REST API resource ID. Default is generated by the framework
restApiRootResourceId: xxxxxxxxxx # Root resource ID, represent as / path
{% endhighlight %}

`terraform` can easily export these values to `parameter store` for us:

{% highlight terraform %}
resource "aws_ssm_parameter" "api_gateway_rest_api_root_resource_id" {
key_id = "alias/aws/ssm"
name = "/api-gateway/rest-api/root-resource-id"
type = "SecureString"
value = aws_api_gateway_rest_api.my_gateway.root_resource_id
}

resource "aws_ssm_parameter" "api_gateway_rest_api_id" {
key_id = "alias/aws/ssm"
name = "/api-gateway/rest-api/id"
type = "SecureString"
value = aws_api_gateway_rest_api.my_gateway.id
}
{% endhighlight %}

Luckily, the serverless framework supports pulling values directly from parameter store during deployment:

{% highlight yaml %}
apiGateway:

# attach to the existing api gateway

restApiId: ${ssm:/api-gateway/rest-api/id}
restApiRootResourceId: ${ssm:/api-gateway/rest-api/root-resource-id}
{% endhighlight %}

That's it! Terraform manages the `api-gateway`, exports a couple of key attributes off of the gateway out to the parameter store, and the serverless framework imports those values during its deployment.

Even better, now you can put this glittery, single gateway behind a `route 53` entry, to make a beautiful, predictable url that will follow `terraform` from environment to environment.

### gotchas

- we deploy our serverless stacks under a given `role`, so that role must have permissions to the parameter store values. Also, if developers run these lambdas locally, they must also have permissions.

{% highlight terraform %}
{
Effect = "Allow"
Action = [
"kms:Decrypt",
"ssm:GetParameter"
]
Resource = [
"arn:aws:ssm:${var.region}:${var.account_id}:parameter/api-gateway/rest-api/id",
"arn:aws:ssm:${var.region}:${var.account_id}:parameter/api-gateway/rest-api/root-resource-id",
"arn:aws:kms:${var.region}:${var.account_id}:alias/aws/ssm"
]
}
{% endhighlight %}

- your stacks just took an infrastructure dependency. If `terraform` ever decides to blow away the gateway for whatever reason, you now want any stack to deploy after infrastructure.
- `serverless deploy` only deploys if there are changes to application code. So think about a scenario where `terraform` recreates the gateway, with no application code changes. Your lambdas would never be re-attached to the gateway. Consider now deploying all dependent stacks using `serverless deploy --force`.
