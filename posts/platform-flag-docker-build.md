---
title: platform flag, docker build
tags: [arm, docker]
date: "2023-02-17"
---

I thought this was worthy of a stand-alone post because I wasted too much time on it today. The worst part is, I do this all day at work.

When working with arm-based technology, specifically containers, and your machine is Intel-based.... **ALWAYS** remember the `--platform linux/arm64` build parameter.

I re-ran into this issue during my [eks](/posts/practice-eks-thread) learning session today.
