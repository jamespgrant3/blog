---
layout: post
title: running a custom container in a lambda
tags: aws container lambda
---
### running a custom container in a lambda

I have been in automation-mode for a few months now at work. I want to automate as many of my tedious responsibilities as possible.

One of these tasks is running hasura migrations. Developers create migration scripts, and until now, this has been a manual step in the deployment. Coupled with several development environments, this task is time consuming and HAS to be automated.

We run hasura as an ECS task. I saw that hasura offers a migration container, see [here](https://hub.docker.com/r/hasura/graphql-engine/tags?page=1&name=cli-migrations). However, that container runs the migrations and then starts the server. Maybe I could have figured out to run migrations and terminate? It wasn't supported out of the box, and I wanted the two separated. I didn't want to have to deploy a new container just to run migrations.

I first attempted to install the hasura-cli within a lambda, and run the migrations this way. I can't recall the exact issue, but there was a post-install step in hasura-cli that prevented that from being a viable option.

My next thought was to run the process in an ECS task. The problem there was, I really wanted developers to have the ability to run these migrations ad-hoc, so I'd have to wrap a call to start the ECS task in a lambda. So, why not just try to run the entire process in a lambda? Afterall, lambda now supports running custom containers.

So I started down this path. I quickly got hit with resistance. The first being, how does lambda call code within this custom container? I mean, think about it. When you execute a lambda, you provide a handler to the runtime, which is something like `path-to-filename.exported-function-name`. Enter [aws-lambda-ric](https://www.npmjs.com/package/aws-lambda-ric). This package is the glue between lambda and your code being executed.

After a lot of fighting, I basically copied the example from `aws-lambda-ric`, and made a few tweaks.

The next issue I encountered were permissions issues around `/home/sbx_user1051`. The hasura-cli runs under a user, `sbx_user1051`. So I ran the container under that user, and symlinked `/tmp` to the appropriate directory.

The final issue was around ssl certificates, I was receiving the following error: `x509: certificate signed by unknown authority`. A coworker suggested pushing the root CA's into the container. The solution:
- install `ca-certificates` in the container
- get the AWS root CA's, [here](https://www.amazontrust.com/repository/)
- place them where docker expects them, [here](https://docs.docker.com/engine/security/certificates/)

This is the `Dockerfile` I ended up with, I will speak to this file through comments.

```sh
# multi-stage docker build, create the build layer

# hasura-cli hack, it expects a certain user
ARG FUNCTION_DIR="/home/sbx_user1051"

FROM node:14-buster as build-image

ARG FUNCTION_DIR

# base dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

# set the hasura-cli directory using an ENV variable
ENV INSTALL_PATH=$FUNCTION_DIR/hasura-cli

# install hasura cli
RUN mkdir -p $FUNCTION_DIR/hasura-cli
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | VERSION=v2.1.1 /bin/bash

WORKDIR ${FUNCTION_DIR}

# copy the code that will perform the migrations, this is the function that the lambda will call
COPY devops/hasura-migrations /home/sbx_user1051

RUN npm i
RUN npx tsc




ARG domain 

FROM node:14-buster-slim

# update the container, and install ca-certificates
RUN apt-get update && \
    apt-get install -y \
    ca-certificates

# add the user hasura-cli expects
RUN useradd -ms /bin/bash sbx_user1051

# copy migrations to the dist folder, to run them
COPY devops/migrations /home/sbx_user1051/dist

# make the directory that docker expects, $domain is passed in when we build the container
RUN mkdir -p /etc/docker/certs.d/$domain

# copy CA certs where docker expects them
COPY devops/root-certs /etc/docker/certs.d/$domain

# put hasura in the PATH
ENV PATH="${PATH}:/home/sbx_user1051/hasura-cli"

# this symlink is needed for the actions the hasura-cli takes 
# upon initialization
RUN ln -s /tmp/ /home/sbx_user1051/.hasura

ARG FUNCTION_DIR

WORKDIR "/home/sbx_user1051/dist"

COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

USER sbx_user1051

# magic of aws-lambda-ric, run as the entrypoint, pointing to the file/function that the lambda should run
ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["index.runMigrations"]
```

As I mentioned, `$domain` is passed in from the building of the image. This is because migrations run in multiple environments, and the domain changes between environments. The building of the container looks something like this:

```sh
docker build \
--build-arg domain=$SOME_DOMAIN_DEFINED_IN_CIRCLECI \
-f devops/Dockerfile  \
-t <some-tag-here> .
```

This was it. This took a lot of trial and error, as time allowed. But, I can now shave hours off of my week. The next step is to integrate executing this lambda during the build so that the process is fully automated.
