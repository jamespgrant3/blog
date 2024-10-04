---
title: "today I learned about: aws cli query functions"
tags: [aws, aws-cli]
date: "2024-10-03"
---

Today I learned about client-side functions you can use when applying the `--query` parameter to your aws-cli command. The `--query` parameter uses [JMESPath](https://jmespath.org/) to create expressions for filtering.

We have several serverless stacks that deploy lambdas. Using the aws-cli, I needed a way to filter lambda function names by that service.

When declaring the service using the serverless framework, you specify the service name. So if we declared a service named `acme`, the serverless framework would have that service name in each lambda.

JMESPath provides several [built in functions](https://jmespath.org/specification.html#built-in-functions), one of which is [contains](https://jmespath.org/specification.html#contains). The signature for this function is as follows:

```sh
boolean contains(array|string $subject, any $search)
```

So you pass in a `subject` as the first parameter and a `search` term as the second. An abbreviated response from the `list-functions` command looks something like this:

```sh
{
    "Functions": [
        {
            "TracingConfig": {
                "Mode": "PassThrough"
            },
            "Version": "$LATEST",
            "FunctionName": "helloworld",
            ...
        }
    ]
}
```

Based on this response, we quickly see our `subject` is `FunctionName`, and our `search` term we already know is `acme`. You can also see that our entire response object is wrapped in a `Functions` key.

Our query would look something like this:

```sh
aws lambda list-functions --query "Functions[?contains(FunctionName, 'acme')].FunctionName"
```

The result of this query is a full list of functions, so to limit the response to just the name of the function we append a `.FunctionName`.
