---
title: "practice: ecs (thread)"
tags: [aws, ecs, deep-dive]
date: "2023-12-27"
---

I have been given some thought on what deep dive to take next. Given that I have two containers ready to go from the EKS deep dive, why not try to implement the same setup in ECS? So that's the plan. Attempt to have two ECS tasks communicate, with only one exposed to the world. Ideally using some type of service discovery.

This setup is just like the k8s deep dive I did. The architecture looks something like this:
![ecs architecture](/images/ecs/architecture.png)

- a request comes in to the `/users` endpoint (1)
- the traffic gets routed to the api container
- the api container makes a call to `user.api.local` (2)
- that resolves to the ip address of one of the user containers
- users are fetched from the user service and returned to the browser (3)

You can find the repository I have been working on [here](https://github.com/jamespgrant3/ecs-practice).

#### Update: 12-27-2023
I took some time away, went through some professional struggles and lost time due to mental burnout. But, I am back to learning. I figured I would pick back up with the ECS work.

I removed all the k8s stuff from the `main.yml` and added an ECR repo and an ECS cluster. The README.md at the base of the project now has a lot of the setup instructions.

Tomorrow I plan to start getting into creating a task definition and deploying ECS tasks. Then we'll attempt to call tasks using dns.

#### Update: 01-06-2024
I have the entire implementation working. I have been learning about ECS service discovery, which uses [cloud map](https://aws.amazon.com/cloud-map) under the covers.

So, how does this work?

Aside from the base infrastructure (vpc, alb, etc), I created two ECS task definitions. Among other things, These definitions outline the compute that both services will use. I gave each 1/4 core and 1/2GB of memory...nothing too big.

The task definition also allows for task and execution roles. The execution role is the role that's used when the task spins up. So permissions to get the image are needed. The task role is the role that the task assumes upon execution, so think request lifecycle. If the code within the task needs to talk to a DynamoDB table or an s3 bucket, this is where those permissions would go.

I then created an ECS cluster and added 2 services: `api` and `user-api`. It's the service's responsibility to ensure you have the desired number of tasks running at all times. Each service has its own security group. The api services security group allows requests from the load balancer, and the user-api services security group allows requests from the api service.

With this in place, I had an application load balancer that could make requests to the api service. So if I went to `localhost:3000` a hello world page would display. However, if I went to `localhost:3000/users` an exception would occur. This is because that endpoint is attempting to make a request to the user service, using `http://user.api.local` and it cannot resolve the url. Enter service discovery, or cloud map.

The first thing I had to do was create a [private dns namespace](https://docs.aws.amazon.com/cloud-map/latest/api/API_CreatePrivateDnsNamespace.html). All this does is create a private hosted zone in route53. You can create a public hosted zone as well, but in this case I wanted something that could route traffic to private services within the VPC. This creates the framework to resolve `api.local` entries.

![hosted zone](/images/ecs/hosted-zone.png)

Next, I created a [service discovery service](https://docs.aws.amazon.com/cloud-map/latest/api/API_CreateService.html). This service acts as a registry, for resources to attach to. In our case, ECS tasks will register their ip address. I named this service `user`. This will allow for this service to create entries in our namespace under the subdomain `user.api.local`.

![tasks in hosted zone](/images/ecs/tasks-in-hosted-zone.png)

Finally, in the ECS service we designate a service registry. I think of this as the glue. Whenever a task starts, it talks to the service discovery service, or registry, to let it know its ip address. The registry then creates dns entries in our namespace which allows traffic to be routed to it.

You can use the cli to verify any step along the way. Here is a cli query that fetches the ip address of each task.

![ecs ips](/images/ecs/ecs-ips.png)

I can query the instances in service discovery, providing the namespace and service name as parameters to the query. As you can see, the ip's match. You can also see in the screenshot above, there are dns entries for these ip's in the namespace.

![discover instances](/images/ecs/discover-instances.png)

This was a great exercise. The most difficult part was understanding cloud map/service discovery. Most of my translation above is that, how I think it all works. I felt like the aws documentation did a great job outlining all of the individual components. So they talk about namespaces and services, but they really did not discuss the interconnectivity...or maybe I just missed it?

I hope you got something out of this. Next, I want to pick a couple of observability tools and sprinkle that into this ECS project. In an effort to get a full trace, I might remove the hard-coded user list and have it fetch from DynamoDB or something?
