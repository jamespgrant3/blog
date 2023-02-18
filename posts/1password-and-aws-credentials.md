---
title: "1password and aws credentials"
tags: [productivity]
date: "2023-02-10"
---

I heavily rely on 1password for my daily workflow. I have to be in any given environment at any given time, and want to admit a bad practice I had. I had a bash script that exported aws credentials based on what environment I wanted to be in. Yes, they were on my machine (except for prod), yes it felt wrong, and yes I knew there was probably a better way.

1password taught me that better way. [This](https://blog.1password.com/1password-cli-2_0) blog article came out, and I immediately implemented it. I don't want to go into the setup, because that article does it perfectly. Instead I will show you some things I did to speed my flow up. This post assumes you have gone through the setup process, which helps understand some of the concepts I cover.

First, I created an alias that basically tells me what identity I am. A nice, simple, who am I...and it looks like this:

```sh
alias who="aws sts get-caller-identity"
```

Next, I needed a way to become an identity. I had to inject which vault (logical grouping of items) and item 1password should grab. 1password allows for this by way of a [secret reference](https://developer.1password.com/docs/cli/secret-references).

I created `1pec`, which stands for 1password export credentials. It takes in two parameters, the vault, and an item in the vault.
As long as you have an `access_key_id` and a `secret_access_key` defined on the item, this works beautifully. Here is the script:

```sh
1pec() {
  1pcc

  echo "calling 1pw with: op://$1/$2/"

  # export the op secret reference syntax
  echo "AWS_ACCESS_KEY_ID=op://$1/$2/access_key_id" >> $HOME/.config/op/aws-env
  echo "AWS_SECRET_ACCESS_KEY=op://$1/$2/secret_access_key" >> $HOME/.config/op/aws-env
  who
}
```

Ignore `1pcc` for now, but this script exports the credentials to the config file, and echos out the identity for validation.

Next, I needed a way to clear these credentials at any time. I chose the name `1pcc`, which stands for 1password clear credentials. It clears out the file that 1password reads from, and then tells me who I am...which should print out no identity. The script looks like this:

```sh
1pcc() {
  echo "clearing credentials"
  : > $HOME/.config/op/aws-env
  echo "after clearing credentials, you are now:"
  who
}
```

That's cool, but how can I really use this? Well, the final step is identifying your environments and coming up with a rememberable naming convention.
I chose `e<env><persona>`, the `e` stands for export. For me, I am ever only one persona, admin which I abbreviate with an `a`. The script looks like this:

```sh
# export dev admin
eda() {
  1pec "Shared Advanced Devops Access" aws-dev
}

# export qa admin
eqa() {
  1pec "Shared Advanced Devops Access" aws-qa
}
```

This function calls the export credentials function we defined above. It passes in a shared vault, that I am permissioned to, and the item name in that vault. The only brittleness is the name of the item in the vault. If someone changes that name, this script will break.

So, from the command-line to be in our dev account I can just:

```sh
eda
```

This was a lot, but helps to secure your machine and environments. Credentials are not on your system and you have to be authenticated by 1password to pull the credentials. Speaking of that, you can also [enable touch id](https://support.1password.com/touch-id-mac) to eliminate the need to continuously enter a password.

I hope this has helped you in some way.
