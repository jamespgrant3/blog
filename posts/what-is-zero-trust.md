---
title: "what is zero trust"
tags: [security, zero-trust]
date: "2023-03-01"
---

I started a new book, [Zero Trust Security: An Enterprise Guide](https://a.co/d/8vAsnj6), this week.

![zero-trust-book](/images/zero-trust-book.jpg)

I have learned some interesting things already. When I think of zero trust, I immediately think of networking and permissions. Ensuring resources are private, and only those with the appropriate permissions are able to access the resources.

Zero trust actually centers around data, and that is what is to be protected. Resources that work with the data are: workloads, people, networks, and devices. All of these should follow zero trust principles to ensure the data is protected.

A core principle that I hadn't thought of, around zero trust, is _adopting a least privilege strategy and strictly enforcing access control_. The text makes mention of a login page, for a finance system. Usually, you would restrict access to this system by placing it behind a login page. This is no longer secure. There are vulnerabilities that do not require login. The ability to send packets to the server is actually considered a privilege. If you do not have access, you should not even see the login page. I thought that was interesting, I had never really thought about it like that before.

This book is definitely opening my eyes in ways to think about security. I look forward to the next chapter.
