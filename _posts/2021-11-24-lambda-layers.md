---
layout: post
title: lambda layers
tags: aws lambda serverless
---
### lambda layers
I couldn't wait until 12/1 to start the lambda deep-dive 😂.

Recently while mowing the grass, I was listening to a podcast about how you can share lambda layers, for code re-use. I had deployed a layer in the past, to help cut down on the deployment size and decrease lambda cold starts. BUT, I didn't know layers were a one to many. So I did a cute little deep-dive.

## Learnings
- layers are a completely separate resource, isolated from a lambda

- you can associate a layer to one or many lambdas

- your layer zip should adhere to a specific folder structure, for javascript it's:
`nodejs/node_modules` or `nodejs/node14/node_modules`

- if this pathing is followed, you just `import` as if it were in your `node_modules` directory

- lambdas are given permissions to the layer using a resource policy, on the layer
  - the resource policy is not visible on the layer, within the aws console
  - you use ```aws lambda add-layer-version-permission``` to add permissions
  - the output of this command is actually the policy

- you can also associate a layer with a lambda in the console, this also updates the layer resource policy

- layers decrease the deployment size, helping improve cold-start times


## Quotas
- a lambda and layer version have up to 75GB's of storage

- a function can have up to 5 layers

- deployment package size for 50MB zipped, and 250MB unzipped, this includes files for the function and layer

## Cost
There is no additional cost for using runtimes and layers
