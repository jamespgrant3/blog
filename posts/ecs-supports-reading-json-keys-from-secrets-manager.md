---
layout: post
title: ecs supports reading json keys from secrets manager
tags: [aws, ecs, secrets-manager]
date: "2021-10-23"
---

**tl;dr**: ecs supports reading json keys from secrets manager, see the [feature release](https://aws.amazon.com/about-aws/whats-new/2020/02/amazon-ecs-now-supports-aws-secrets-manager-version-and-json-keys/).

We recently implemented secrets rotation for our postgres database. One of the unintended consequences of doing so was figuring out how our hasura ecs tasks could continue to connect post-rotation.

The way [connections](https://hasura.io/docs/latest/graphql/core/deployment/graphql-engine-flags/reference.html#graphql-engine-command-flags-environment-variables) work for hasura, you have to supply the entire connection string, using an environment variable: `HASURA_GRAPHQL_DATABASE_URL`. So, whenever secrets rotation fired, we needed to update the connection.

We were already storing everything needed for the connection string to be constructed within the secret that was being rotated. So, we decided to add a `connectionString` property to the secret. But, how would we update the task cleanly?

Secret definition:

```terraform
resource "aws_secretsmanager_secret" "postgres_hasura_user" {
  name  = "postgres/user/hasura"
}
```

```terraform
resource "aws_secretsmanager_secret_version" "postgres_hasura_user" {
  secret_id = aws_secretsmanager_secret.postgres_hasura_user.id
  secret_string = jsonencode({
    connectionString = "postgres://someusername:somepassword@somehost:5432/database"
    # other values
  })
}
```

As it turns out, you can reference the json property by appending the json key to the arn. So, we updated the task definition to reference this arn...like so:

```terraform
resource "aws_ecs_task_definition" "hasura_devops" {
  container_definitions = templatefile("${path.module}/hasura.json", {
    postgres_connection_string = "${aws_secretsmanager_secret.postgres_hasura_user.arn}:connectionString::",
}
```

Our container definition then pulls the `valueFrom` the arn:

```json
[
  {
    "secrets": [
      {
        "name": "HASURA_GRAPHQL_DATABASE_URL",
        "valueFrom": "${postgres_connection_string}"
      }
    ]
  }
]
```

Finally, in the lambda that was doing the rotation, we just made an aws cli call to update the ecs service to use the new connections string.

`aws ecs update-service --cluster our-cluster --service hasura --force-new-deployment`

There are several advantages to pulling the connection string from the secret. The first of which is the implicit deny nature of IAM. Unless you explicitly allowed access to the secret, it is tucked away and secure. Developers might have access to see the task definition using the aws console and/or cli. If we didn't pull the connection string from a secret, your database credentials would be visible in plain sight. With this approach, only the arn is visible.

You can do alot with the secrets arn, you can find more secrets examples [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html#secrets-examples).
