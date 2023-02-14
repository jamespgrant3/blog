---
layout: post
title: "practice: eks (thread)"
tags: [aws, eks, practice]
date: '2023-02-06'
---
I was speaking to a good friend of mine this weekend, and he had a brilliant idea....as he always does. He recommended that I not only blog tech things, but that I actually DO some tech things, and talk about it.

As we're talking, my brain is thinking about all the possibilities. I quickly landed on EKS. I had an early love for k8s. Every time I have had an opportunity to interact with it, it's been abstracted away from me.

My goal is to use cloudformation, and only focus on the cloud. I am  not worried about pipelines, or the cleanest of typescripts. All the code will be in one repository, so you should be able to easily recreate the infrastructure and hopefully learn from it. I will try to script out as much as I can, to remove some of the tediousness.

Rather than individual posts throughout the learning, I will continue to update this post.

Today, I created an [eks-practice](https://github.com/jamespgrant3/eks-practice) repository. I did steal some yaml to scaffold out the vpc, but other than that I plan on writing everything.

_Update: 02-07-2023_

Today I scaffolded out the api and user-api, using the cli that [nestjs](https://nestjs.com) provides. I enjoy nest for its built-in dependency injection, and simplistic approach. Again, I just want a couple  simple apis.

Tomorrow I hope to start getting the apis to call one another and begin to dockerize them...setting myself up for the fun part :)

_Update: 02-08-2023_

I was able to get the two api's communicating. So a call to the `/users` endpoint in the api is calling the `/` endpoint on the user-api. Given the new moonlander board, it's taking a little more time than I thought. Next step, dockerizing.

_Update: 02-09-2023_

I was able to get both api's dockerized, check it out [here](https://github.com/jamespgrant3/eks-practice/commit/d4c8ca5a6503ececa0109fd8c338a7804d8b1c1c). Since I had written a post about distroless images, I decided to use it. They actually have several good [base images](https://github.com/GoogleContainerTools/distroless#what-images-are-available), with runtimes already installed. It was surprisingly little effort, the biggest hurdle was around docker networking.

Looking forward to starting the EKS work tomorrow!
