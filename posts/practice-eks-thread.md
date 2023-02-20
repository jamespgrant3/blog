---
title: "practice: eks (thread)"
tags: [aws, eks, practice]
date: "2023-02-06"
---

I was speaking to a good friend of mine this weekend, and he had a brilliant idea....as he always does. He recommended that I not only blog tech things, but that I actually DO some tech things, and talk about it.

As we're talking, my brain is thinking about all the possibilities. I quickly landed on EKS. I had an early love for Kubernetes, also abbreviated k8s. Every time I have had an opportunity to interact with it, it's been abstracted away from me.

For those that don't know, EKS stands for Elastic Kubernetes Service. It's AWS' answer to a managed service that runs a k8s cluster. You can read more [here](https://aws.amazon.com/eks), but at a high level k8s is a container orchestration service. It manages the availability and scalability of your container-based workloads.

At the core, you have a cluster, nodes, and pods. A cluster manages one or more nodes.  Nodes are a machine, or server, devoted to running your pods. A pod is an instance of your application, running inside a container.

How does k8s help the scalability of your application? You configure an ideal state for k8s, and it will do its best to ensure that state is met. Let's say you instruct k8s to have 3 pods containing your web ui running across your cluster. If for some reason a pod dies, k8s will ensure another one is created for you. You can also configure k8s to scale the amount of pods up or down based on metrics like cpu utilization.

How does k8s help your applications availability? A cluster contains one to many nodes. You can configure k8s to have nodes that span availability zones (AZ). An AZ is a data center. So the idea is, you spread your compute out across several AZs, and k8s will place your pods on these nodes. So in the event an AZ experiences an outage, your application continues to run. In fact, your application will scale to meet desired configuration across the nodes that are left.

My goal with this project is to use cloudformation, and only focus on the cloud. I am not worried about pipelines, or the cleanest of typescripts. All the code will be in one repository, so you should be able to easily recreate the infrastructure and hopefully learn from it. I will try to script out as much as I can, to remove some of the tediousness.

Rather than individual posts throughout the learning, I will continue to update this post.

Today, I created an [eks-practice](https://github.com/jamespgrant3/eks-practice) repository. I did steal some yaml to scaffold out the vpc, but other than that I plan on writing everything.

#### Update: 02-07-2023

Today I scaffolded out the api and user-api, using the cli that [nestjs](https://nestjs.com) provides. I enjoy nest for its built-in dependency injection, and simplistic approach. Again, I just want a couple simple apis.

Tomorrow I hope to start getting the apis to call one another and begin to dockerize them...setting myself up for the fun part :)

#### Update: 02-08-2023

I was able to get the two api's communicating. So a call to the `/users` endpoint in the api is calling the `/` endpoint on the user-api. Given the new moonlander board, it's taking a little more time than I thought. Next step, dockerizing.

#### Update: 02-09-2023

I was able to get both api's dockerized, check it out [here](https://github.com/jamespgrant3/eks-practice/commit/d4c8ca5a6503ececa0109fd8c338a7804d8b1c1c). Since I had written a post about distroless images, I decided to use it. They actually have several good [base images](https://github.com/GoogleContainerTools/distroless#what-images-are-available), with runtimes already installed. It was surprisingly little effort, the biggest hurdle was around docker networking.

Looking forward to starting the EKS work tomorrow!

#### Update: 02-14-2023

Today, I was able to scaffold out the EKS role and cluster, see [here](https://github.com/jamespgrant3/eks-practice/commit/d86f2908a7627c8d9753f5675460657c78709b7e). I am not super familiar with CloudFormation, so it took a little extra time this morning to get my head around it. No major opinions yet, as everything I am doing is really simplistic.

I also pushed up the two images to DockerHub. You can see both images [here](https://hub.docker.com/search?q=jamespgrant3).

My next steps are to start getting pods in the cluster, and figuring out how to manage the cluster locally.

#### Update: 02-15-2023

Today wasn't too productive. I was able to get `kubectl` installed, and ran a command to update my local config to point to my EKS cluster:

```sh
aws eks update-kubeconfig --region us-east-1 --name k8s-practice
```

This command added a `config` file to my `$HOME/.kube` directory.

#### Update: 02-16-2023

Today I added a node role and a node group, see [here](https://github.com/jamespgrant3/eks-practice/commit/77a297fe375bdd6c94b246d89d91fe6efb8c2f0).

The node role gives permissions for a few things. First, It gives read only permissions to ECR. It gives several describe permissions to EC2 and the EKS cluster. It also gives the node the ability to do things nodes need to be able to do: assign private IP's and manage network interfaces.

Prior to making the node group, I started making the k8s deployment. I applied the deployment....and waited and waited. It wouldn't start. Finally, I described the pods.

![no-nodes](/images/eks/no-nodes.png)

![console-no-nodes](/images/eks/console-no-nodes.png)

Imagine that, an EKS cluster needing compute! :) That's when I read about node groups. After about 5 minutes, I had compute!!!

![kubectl-nodes](/images/eks/kubectl-nodes.png)

![console-nodes](/images/eks/console-nodes.png)

We're getting closer, little by little!!

#### Update: 02-17-2023

Today was some good learning, AND, I was able to get pods running. You can see todays changes [here](https://github.com/jamespgrant3/eks-practice/commit/1b717d87cd70ff417012954fd5aa2bb066264f5e).

First mistake...attempting to be cheap and run a k8s cluster on `t4g.micro` instances. I kept getting this in the console:

![cheap-instance-console](/images/eks/cheap-instance-console.png)

When I looked in the console, there was 0 capacity:

![cheap-instance](/images/eks/cheap-instance.png)

So I increased to the next cheapest option: `t4g.small`. I then had enough capacity to run this entire project.

![capacity](/images/eks/capacity.png)

This next issue took some time, and it shouldn't have. I kept getting the ole `Back-off restarting failed container` error.

![backoff](/images/eks/backoff.png)

Of course, I exhausted all of my searches. Finally, I looked at the logs for the pod and saw `exec /usr/local/bin/docker-entrypoint.sh: exec format error`. I googled, and started seeing folks talk about chipsets, and it hit me. The cluster is arm-based, my mac is an Intel. This shouldn't have taken so long to figure out, I already cross-compile containers all day at work. When I finally added the `--platform linux/arm64` option to the docker build step....and applied the k8 configuration:

![money](/images/eks/money.png)

Money!! Pods were running.

Next, I think I have to get the deployment behind a k8s service...I think? I then have to front the service with a load balancer. So close!!

#### Update: 02-20-2023
Today, I was able to finally get the cluster working, see the commit [here](https://github.com/jamespgrant3/eks-practice/commit/a2b54cd3c5c6dce2d37be2bd1be566464e0aed4f)!!

This commit does several things. First, I created two services. In k8s, a service is a grouping of pods. The service manages the ip addresses of the pods that match a selector, and it exposes these pods as a single dns. I created a service called the `user-api-service`. These pods are now exposed to the cluster, with a simple call to `http://user-api-service`, assuming that you have not defined a network policy.

Next, I created a service for the api-service. This service has a `LoadBalancer` type. Which means just that, k8s exposes this service to the outside world using a load balancer. So what is happening here? I wanted to mimic a SOA, a service calling another service.

The `api-service` is a base api, and it exposes a `/users` route to the world. When called, that api makes a call to the `user-api-service`, and returns a random number of users with random names.

![payload1](/images/eks/payload.png)

Cool, how is all of this really working....and prove it!

Looking at the commit above,  I instructed k8s to maintain 2 replicas of the deployment for each of the apis. Looking at `kubectl`, which I have aliased as `k` for simplicity, you see 4 pods running.

![pods](/images/eks/pods.png)

Lets describe the api pods.

![describe-pod-1](/images/eks/describe-pod-1.png)

![describe-pod-2](/images/eks/describe-pod-2.png)

Each pod has its own ip address. These ips should be managed by the service, lets see:

![describe-svc](/images/eks/describe-svc.png)

And, k8s actually has an `endpointslices` resource that the `service` references. It's a more focused view of just the ip addresses:

![get-endpointslices](/images/eks/get-endpointslices.png)

This implementation works. And, I know there is room for improvement. For example, I think it's a best practice to use an ingress controller. Which is a k8s resource that sits between the load balancer and pods. You can create routing rules to route traffic to pods. I could also put a network policy on the user-api, to only allow the base api to talk to it.

The purpose of this little deep dive was to relearn k8s, and demonstrate it in a working example. I might pop back in this project to update it.

I often wonder when I would use k8s. Clearly it's real power is when you're into SOA. Service discovery is powerful, control over pod communication is useful. I struggle with the cost. I have seen implementations with 40 nodes running in ONE test environment....and they had several lower environments. Granted, this was a huge company, so they could afford it. But, should they have to when there are alternatives? I couldn't see the bills, but I can only imagine. Since I left, they pulled the k8s plug. All-in on ECS Fargate. I guess, in the end, they realized they shouldn't have to.

I'm not knocking k8s. I think it could be easy to jump onboard, because it is really cool. There are serious cost and management implications, so I would definitely consider all options before going down that path.
