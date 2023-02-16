---
layout: post
title: "today I learned about: bottlerocket"
tags: [aws, container]
date: "2021-11-01"
---

Bottlerocket is a free, open-source, Linux-based OS meant to host containers(ECS or EKS). You can find docs [here](https://aws.amazon.com/bottlerocket/).

This OS is meant to be as bare-bones as possible, allowing for minimal security risks. It contains the linux kernel, system software, and containerd as the container runtime.

The entire OS can be updated in one clean step, as opposed to package by package.
