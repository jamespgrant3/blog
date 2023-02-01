---
layout: post
title: "lambda event source mapping"
tags: aws lambda
---
### lambda event source mapping
As you may already know, aws made some concurrency changes around sqs and lambda invocations. I wanted to do a deeper dive on what event source mapping (ESM) is.

ESMs are used to invoke a lambda, from some event in a handful of aws services. A few of the support services are: dynamodb, kinesis, and sqs.

The ESM uses permissions from the lambdas execution role to interact with the event source.

ESMs batch items together to send to your lambda, which you have complete control over. You can configure the `MaximumBatchingWindowInSeconds` and `BatchSize`. `MaximumBatchingWindowInSeconds` represents the maximum amount of time to gather records, and `BatchSize` is exactly that...the maximum records to fetch in a payload. Services like dynamodb and lambda, the `MaximumBatchingWindowInSeconds` defaults to 0, so it's rapidly sending batches. The next batching cycle does not start until the previous function invocation completes. The batching cycle completes when one of these thresholds are reached. In the event of an error from the lambda, ESM will process the entire batch until it succeeds.

