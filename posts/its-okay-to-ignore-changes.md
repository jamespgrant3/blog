---
title: it's okay to ignore changes
tags: [aws, terraform]
date: "2021-11-07"
---

As I mentioned in a [previous post]({% post_url 2021-10-10-terraform-resource-sharing %}), we use terraform to deploy our api-gateway and attach routes to it using the serverless framework.

The way our build works currently:

- terraform deploys/updates api-gateway
- downstream, serverless framework attaches resources to the gateway

Well, we ran into a bit of a pickle. So, think about this. Terraform has a version of state that the api-gateway should be in. It's also managing a property called `deployment_id` under the covers. It has its perception of what the world should look like. Well later in the build, serverless deploys resources to the api-gateway. The next build, terraform reconciles state and is like...something is off here. And so, it attempts to fix things as seen here:

![deployment_id changes to stage pre change](/images/deployment-id-changes-to-stage-pre-change.png)

This update actually removes resources from the stage that were added outside of terraform, i.e. serverless framework. We didn't realize this until the downstream serverless deploy failed. None of the routes worked because the serverless deploy never reattached them. It then became apparent that this had been happening, but because our serverless build was successful, all the routes reattached themselves. **BUT**, from the time terraform updated api-gateway, and the serverless build completed....we were "technically" down.

I found out that you can instruct terraform to `ignore_changes` to resource properties, like so:

```terraform
resource "aws_api_gateway_stage" "some_stage" {
  # more stage configuration
  deployment_id = aws_api_gateway_deployment.some_deployment.id

  lifecycle {
    ignore_changes = [
      # ignore changes to the deployment_id, because serverless framework
      # is attaching routes, it too will change the deployment_id
      deployment_id
    ]
  }
}
```

Here, we tell terraform to ignore changes to `deployment_id` on the api gateway stage. As you can see in the build, terraform still recognizes that something changed, it just doesn't make any modifications to the api-gateway. Now, we leave the api-gateway intact so that routes attached by the serverless framework persist:
![deployment_id changes to stage post change](/images/deployment-id-changes-to-stage-post-change.png)

In this case, it's okay to ignore changes. We really don't care about changes to the stage because it's understood that terraform state will never be insync. Any changes to the api-gateway will still be deployed, we just don't care about the `deployment_id`.
