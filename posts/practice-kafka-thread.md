---
title: "practice: kafka"
tags: [aws, kafka, deep-dive, k8s]
date: "2025-02-08"
---

I recently had the urge to learn about kafka. I have an upcoming integration with it at work, and it often comes up in my tech readings. I have a fundamental understanding of its purpose but I have never actually used it. Rather than starting with the AWS [msk](https://aws.amazon.com/msk) managed service, I wanted to learn kafka.

First, I started with local docker containers. I got that working, but in learning about how kafka scales consumers, I wanted to be able to play around with that, and so I got it running in kubernetes.

Rather than going into what kafka is, this post is going to put kafka to practice. If you are looking for a good starting point to learn about kafka, I followed [these](https://youtube.com/playlist?list=PLa7VYi0yPIH0KbnJQcMv5N9iW8HkZHztH&si=08gszJIeSM2UIbL3) videos.

## toolset
To complete this exercise you need to install the following:

[colima](https://github.com/abiosoft/colima) is a container runtime\
[minikube](https://minikube.sigs.k8s.io) allows us to run a local kubernetes cluster\
[k9](https://k9scli.io) is a k8s terminal management tool

Here is a link to documentation related to the technologies we will be using:

[kubernetes](https://kubernetes.io) is a container orchestrator\
[kafka](https://kafka.apache.org) a distributed streaming platform designed to handle large volumes of data\
[kafka-ui](https://github.com/provectus/kafka-ui) presents a ui to manage kafka

## repo
All of the code required to get a cluster stood up can be found [here](https://github.com/jamespgrant3/kafka-practice).

## k8s
The first step is to get kubernetes running. To do this, we need a container runtime (colima) and a k8s cluster (minikube).

### colima
After intalling colima, run the following command to start it:
```bash
colima start --cpu 4 --memory 16
```

### cluster
This command starts the cluster, and then attaches the docker command to minikube. So any docker or k8s commands we run will be run inside k8s.

```bash
minikube start && \
eval $(minikube docker-env)
```

To unset this command, and allow docker to look at your local images use the following:

```bash
eval $(minikube docker-env -u)
```

## consumer build
Now it's time to build the consumer and producer images we will use to push and receive messages to and from kafka.

Run this script at the root of the repo, to build the consumer.
```bash
cd consumer && \
npm i && \
npm run build && \
docker build -t consumer:v1 .
```

## producer build
Run this script at the root of the repo, to build the producer.
```bash
cd producer && \
npm i && \
npm run build && \
docker build -t producer:v1 .
```

## base infrastructure
This step deploys the base kafka infrastructure: a broker and zookeeper. Zookeeper is used to manage configuration across brokers in kafka.

Run this script at the root of the repo:

```bash
kubectl apply -f ./infra.yml
```
If you open k9s, and look in the kafka namespace, you should now see the kafka and zookeeper pods running.

![kafka-zookeper](/images/kafka/kafka-zookeeper.png)

## services
Now it's time to start deploying our configurations. This step will also deploy a broker, and the kafka ui to help us see what's going on inside the cluster.

Run this script at the root of the repo to deploy the broker:

```bash
kubectl apply -f ./broker.yml
```
Now run this at the root of the repo to deploy the kafka-ui:

```bash
kubectl apply -f ./kafka-ui.yml
```

Before we deploy the consumer, we need to create the topic. You can configure the broker to auto-create the topic for us, but for this example I wanted to demonstrate how to create the topic. Within the confluent image I am using to run kafka, I have set `KAFKA_AUTO_CREATE_TOPICS_ENABLE` to `false` to avoid auto creation.

To create the topic, shell into the broker using k9s, and run this:

```bash
kafka-topics --create --topic my-topic -partitions 1 --replication-factor 1 --bootstrap-server kafka-broker:9092
```

![topic-creation](/images/kafka/topic-creation.png)

Another quick look at the kafka namespace within k9s, and you'll see the producer, consumer, and a kafka-ui pod running.

Now we are ready to deploy the consumer:

```bash
kubectl apply -f ./consumer.yml
```

k9s now shows all of our services running:

![kafka-services](/images/kafka/kafka-services.png)

To take a look at kafka-ui, run the following command to expose the kubernetes service through a NodePort:

```bash
minikube service -n kafka kafka-ui --url
```
This command will provide a url you can use in the browser. You should see the following:

### broker
![broker](/images/kafka/broker.png)

### consumer
![consumer](/images/kafka/consumer.png)

### topic
![topic](/images/kafka/topic.png)

## publish messages
In another terminal, we need to expose the producer:
```bash
minikube service -n kafka producer --url
```

Take note of the url, I usually set that to an environment variable:
```bash
export PRODUCER_URL=http://127.0.0.1:62614

curl -d '{"topic":"my-topic","messages": [{ "key": "payment",  "value": "a payment of $500 was made" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "address_change",  "value": "the address was changed to 123 Main St." }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "charge",  "value": "a purchase was made for $35" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "credit_line_increase",  "value": "credit line increased to $5000" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL

curl -d '{"topic":"my-topic","messages": [{ "key": "payment",  "value": "a payment of $35 was made" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "address_change",  "value": "the address was changed to 456 Some Other St." }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "charge",  "value": "a purchase was made for $550" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
curl -d '{"topic":"my-topic","messages": [{ "key": "dispute",  "value": "a transaction was disputed for $4500" }]}' -H "Content-Type: application/json" -X POST $PRODUCER_URL
```

## results


![topic-results](/images/kafka/topic-results.png)

![message-results](/images/kafka/message-results.png)
