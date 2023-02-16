---
layout: post
title: step functions, state machine
tags: [aws, step-functions]
date: "2022-02-14"
---

States are the basic building block of the state machine. They must have a name that is unique within the scope of the state machine.

There are a variety of different types of states.

### States

#### Task

- all work is done by tasks
- represents a single unit of work within the state machine
- performs work via a `Resource` defined in the state, which can be:
  - a Lambda
  - activity (ec2/ecs worker)
  - an api action of other services

#### Choice

- adds the ability to add logic to the state machine
- performs logic using `Choices` defined in the state machine.

#### Pass

- passes the input of the task, to its output, useful when debugging

#### Wait

- delays the state machine from continuing for a certain period of time

#### Succeed

- stops the state machine execution

#### Fail

- stops the state machine execution, and marks it as a failure

#### Parallel

- creates parallel branches of execution within the state machine
- waits for all branches to reach a terminate state before the states `Next` field is executed
- if an exception occurs in one branch, the entire state is considered a failure

#### Map

- used to run a set of steps for each element in an input array
- result is a json array, each item is the output of an iteration

### State Machine Data

State machine data has several forms:

- the initial state machine input
- data passed between states
- the output of the state machine

This week, I hope to create a working example of a state machine using CloudFormation. I will be pushing to my [step-functions-example](https://github.com/jamespgrant3/step-functions-example) repo.
