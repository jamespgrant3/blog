---
layout: post
title: "lambda event source mapping"
tags: aws lambda
---
### lambda event source mapping
As you may already know, AWS made some concurrency changes around sqs and lambda invocations. I wanted to do a deeper dive on what event source mapping (ESM) is.

ESMs are used to invoke a lambda, from some event in a handful of AWS services. A few of the support services are: dynamodb, kinesis, and sqs.

The ESM uses permissions from the lambdas execution role to interact with the event source.

ESMs batch items together to send to your lambda, which you have complete control over. You can configure the `MaximumBatchingWindowInSeconds` and `BatchSize`. `MaximumBatchingWindowInSeconds` represents the maximum amount of time to gather records, and `BatchSize` is exactly that...the maximum records to fetch in a payload. Services like dynamodb and lambda, the `MaximumBatchingWindowInSeconds` defaults to 0, so it's rapidly sending batches. The next batching cycle does not start until the previous function invocation completes. The batching cycle completes when one of these thresholds are reached. In the event of an error from the lambda, ESM will process the entire batch until it succeeds.

This most recent change between sqs and lambda, pushes the scaling back into the ESM. Prior to this change, a developer would set the max concurrency to 5 or whatever. Well, that's cool, but the sqs and the esm do not care. ESM continues to poll the queue and attempt to send messages to the lambda. Since the max concurrency is met, the messages ultimately fail and go into a dead letter queue. Now, we're able to set the concurrency at the ESM level. This prevents lambdas from reading more messages from the queue, when the lambdas reach maximum concurrency.