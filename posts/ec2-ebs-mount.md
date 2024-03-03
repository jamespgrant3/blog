---
title: "remounting ebs volumes to ec2"
tags: [aws, ec2, ebs]
date: "2024-03-02"
---

At work, I recently migrated a neo4j instance into a new AWS account. As part of that work I made a few improvements: created a reusable AMI, upgraded the OS to be Amazon Linux, and separated the data volume to a separate EBS volume.

This worked beautifully. Then, I got a message from a developer that we needed to reboot the instance. I did so, and it never came back up. After looking through logs, I quickly found that neo4j was attempting to recreate the database because it could not find a database. It became evident that the volume was not there.

I stumbled across [this](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html#ebs-mount-after-reboot) article.

I had to run `blkid` to get the UUID of the device. Then edit the `/etc/fstab` file, adding that UUID along with the mount path and a few other parameters. After this update, I rebooted and the instance came back up successfully.

I was grateful the developer asked for that reboot. Finding this issue in a lower environment was way less stressful than having to troubleshoot in production.
