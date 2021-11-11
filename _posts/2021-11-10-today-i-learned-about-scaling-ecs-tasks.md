---
layout: post
title: "today I learned about: scaling ecs tasks"
tags: aws ecs scaling
---
### today I learned about: scaling ecs tasks
Another task I have had in the ole backlog for production readiness, was setting up our hasura ecs tasks to scale. In doing this, I leared about `application-autoscaling`. The first step is setting up a target. In doing so, you specify a `role_arn`. If you don't, terraform will create a service role for you.

I like being explicit, and having as much control over infrastructure and permissions as possible. I started off with an empty role, and through using terraform, the cli gave me **very** clear exceptions as to what permissions were missing. In the end, my auto-scaling permission looked like this:

```terraform
# iam.tf
data "aws_iam_policy_document" "ecs_auto_scale_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["application-autoscaling.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_auto_scale" {
  statement {
    actions = [
      "cloudwatch:DescribeAlarms",
      "ecs:DescribeServices",
      "ecs:UpdateService"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "esc_auto_scale" {
  name        = "ecs-auto-scale"
  description = "A policy to allow ecs auto scaling"
  policy      = data.aws_iam_policy_document.ecs_auto_scale.json
}

resource "aws_iam_role" "ecs_auto_scale" {
  name = "ecs-auto-scale"

  assume_role_policy = data.aws_iam_policy_document.ecs_auto_scale_assume_role.json

  managed_policy_arns = [
    aws_iam_policy.esc_auto_scale.arn
  ]
}
```

We're essentially creating a role, that is assumed by the `application-autoscaling` service, that gives permission to update the ecs service among other things. Afterall, we are scaling tasks within the service. Next comes the fun stuff.

I created an `application-autoscaling` file, and created a `aws_appautoscaling_target`. The target outlines the minimum and maximum task counts, what resource you want to scale, and the dimension of that resource. In our case a `hasura` service, and we want to modify the `DesiredCount`.

This terraform resource type can scale more than just ECS tasks. It's basically an abstraction that can scale a lot of scalable aws resources (Aurora read-replicas, dynamodb tables, lambda provisioned concurrency), see the docs [here](https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html)

```terraform
# application-autoscaling.tf
resource "aws_appautoscaling_target" "hasura" {
  max_capacity       = aws_ecs_service.hasura_service.desired_count * 10
  min_capacity       = aws_ecs_service.hasura_service.desired_count
  resource_id        = "service/hasura"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  role_arn           = aws_iam_role.ecs_auto_scale.arn
}
```

Next, I setup two scaling policies. One for memory, and the other for cpu. Again, I chose the [TargetTrackingScaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-targettracking.html). According to the docs, it's Amazon's preferred scaling policy. Also, to me, it reads really well. You can read the code here and, aside from knowing how the policy type scales, you know what's going on.

```terraform
# application-autoscaling.tf
resource "aws_appautoscaling_policy" "ecs_hasura_scale_memory" {
  name               = "esc-hasura-scale-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.hasura.resource_id
  scalable_dimension = aws_appautoscaling_target.hasura.scalable_dimension
  service_namespace  = aws_appautoscaling_target.hasura.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value = 40
  }
}

resource "aws_appautoscaling_policy" "ecs_hasura_scale_cpu" {
  name               = "esc-hasura-scale-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.hasura.resource_id
  scalable_dimension = aws_appautoscaling_target.hasura.scalable_dimension
  service_namespace  = aws_appautoscaling_target.hasura.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 40 
  }
}
```

The way `TargetTrackingScaling` works is, you provide a `target_value`, and Amazon scales to maintain that target value, but never exceeds the `aws_appautoscaling_target` min and max values. So, in this example if the `hasura_service` had a `desired_count` of 2, the `max_capacity` would be 20 and the `min_capacity` would be 2.

If and when, the `ECSServiceAverageMemoryUtilization` and/or the `ECSServiceAverageCPUUtilization` went over 40%, Amazon would scale your tasks for you to attempt to maintain that `target_value`. Upon those values going back down below the `target_value`, Amazon would start scaling the tasks down.

I write this post after only successfully deploying it using terraform, and the aws console showing the scaling policy. But, I haven't actually tested it. Tomorrow I test using [this](https://httpd.apache.org/docs/2.4/programs/ab.html) cute little tool.🤞
