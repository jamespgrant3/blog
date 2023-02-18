---
title: "today I learned: about a distroless image"
tags: [container, docker]
date: "2023-02-08"
---

I was listening to a cloud security podcast yesterday and it made mention of a distroless container. The discussion was around container vulnerabilities and security, and natually the less you deploy the better.

With this image, you don't have a package manager or a shell. It's simply a 2MiB Linux image, and whatever you deploy on top of it. You really can not get any more barebones than that.

You can read more about it [here](https://github.com/GoogleContainerTools/distroless).
