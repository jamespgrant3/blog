---
layout: post
title: "today I: started tinkering with k8s again"
tags: [k8s]
date: "2021-11-14"
---

It's been awhile since I played with kubernetes, maybe six months or so? In fact, the last time I tried to get a local cluster stood up I became frustrated with getting an ingress controller to work. I was using [microk8s](https://microk8s.io/). I was doing cool things, but couldn't get it exposed.

Ingress controllers are needed to expose your service to the outside world, by mapping a route to a k8s service.

Well tonight, I visted the k8s docs out of boredom, and they suggested using [kind](https://kind.sigs.k8s.io/) to spin up the cluster locally. I had an [ingress controller](https://kind.sigs.k8s.io/docs/user/ingress/) stood up in **NO TIME**!! I was literally making requests from the browser in 5 minutes! Frustration gone!

I am a serverless-first guy, **BUT**, I am also attracted to k8s and feel it's good to be skilled in both worlds.

I really look forward to diving back into k8s and the ecosystem, using technologies like [helm](https://helm.sh/), and blogging about my learnings. 🥰
