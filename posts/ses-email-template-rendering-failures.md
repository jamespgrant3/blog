---
title: "detecting ses template rendering failures"
tags: [aws, ses, sns]
date: "2024-07-18"
---

# overview
We use Amazon's [Simple Email Service](https://aws.amazon.com/ses/) at work to communicate with customers. One feature this service offers is templating, where you define the content of the email and pass parameters into it to customize the content.

We had a situation where we were sending the email using the sdk, getting a 200 response back from the service, but the emails were never being received. This is because the service does some basic validation on the request and sends a response to the client. The email is then sent asynchronously.

This was initially hard to troubleshoot. We did see that emails came through on other templates, so we narrowed it down to the template. After some research, I learned you could [monitor sending activity](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) through events. Spoiler alert, one of the events is `RenderingFailure`. Upon an event, you can be notified several different ways: sns, cloudwatch, eventbridge.

A rendering failure can happen for several reasons, in our case we setup a variable in the template but we were not passing that variable in as part of the request to send the email.

# solution

Our solution was to configure sns to be notified whenever an render failure occurred. sns would then send an email to a distribution list.

steps:

- we setup an sns topic, with the distribution list email address as a subscriber
  - you have to update the topics access policy to allow sns permission to `sns:Publish`
- updated our existing configuration set, adding an event destination.
  - we chose rendering failures as the event type
  - and specified the sns topic as the destination

# helpful links

- [monitoring sending activity](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html)
- [setup event publishing](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-using-event-publishing-setup.html)
