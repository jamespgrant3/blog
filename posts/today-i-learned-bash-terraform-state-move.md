---
title: "bash script to modify terraform state"
tags: [zsh, terraform]
date: "2023-03-06"
---

There is one part of the terraform configuration that I know could be better, and I do not want developers inheriting. So today, I decided to make the change to leave it better than I wrote it.

I created the concept of a "template" in terraform. At one point, we had four development environments. So, rather than having to manage each environment separately, I created a template module that wrapped the configuration of all these environments. So when I changed one development environment, I changed them all.

This sounded like a great idea at the time. I still think it kind of makes sense. Here's the problem. The layers were unmanageable. To add an aws parameter store value, which are managed in a module called common, you had to do the following:
- update the `variables.tf` file in the main module, and update `main.tf` to pass the value down into the template module.
- update the `variables.tf` file in the template module, and update `main.tf` to pass the value down into the common module.
- update the `variables.tf` file in the common module, update the appropriate file to do something with the parameter.

This sucks. I have been dealing with it, because it's just me doing the cloud work. I knew I would fix it someday. However, I do not want others having to deal with my decisions. Also, in the past few months we've decommissioned two of the development environments and have one or two more on deck to be axed. The template module no longer makes sense. This was WAY too many layers for developers to jump through for one common task.

The problem, terraform state is derived from the module structure. In removing the module, when I go to deploy, every resource will look new because the state file no longer matches what terraform is expecting to deploy. The fix is to massage the state file to make it look like what it should look like after a deployment without the template module. This is what state currently looks like:

![terraform-state-list](/images/bash-terraform-state-list.png)

In removing the template module, `module.infra.` gets removed from each resource. So ideally, I would like to generate a shell script that creates a bunch of commands that modify state. We could use a regex to replace `module.infra` with empty text.

How can I easily modify the state? Nobody wants to modify these resources individually. The answer: bash!! The script:

```sh
function modify_state(){
  : > script.sh

  ts_list=$(terraform state list)

  echo "$ts_list" | while read -A line; do
    replaced_line="${line[1]//module.infra./}"
    echo "terraform state mv $line[1] $replaced_line" >> script.sh
  done
}
```

I pieced this together using Google, obviously. But, it's beautiful and it works. Let's now break this script down, in small chunks:

First, we'll clear out the shell script that this bash function generates. So that each run of our function generates a fresh, new file.
```sh
: > script.sh
```

Next, we're going to list our state and assign it to a variable called `ts_list`.

```sh
ts_list=$(terraform state list)
```

Now, the fun stuff. We echo out the variable storing the output from terraform and pipe it to the `read` command. The `read` command takes this printed text as an input, and splits it by line. The `-A` assigns that input to a variable named `line`. Now we can do as we please with each line.

```sh
echo "$ts_list" | while read -A line; do
```

How can we accomplish regex in bash?

```sh
replaced_line="${line[1]/module.infra./}"
```

The syntax here is `input/search-term/replace-term`. For a global replace the syntax is `input//search-term/replace-term`. Here, we are replacing `module.infra`, which is stored in `line[1]`, with nothing.

Finally, we create a [terraform state mv](https://developer.hashicorp.com/terraform/cli/commands/state/mv) command that moves the resource from source to destination in state. We lastly append the line to a `script.sh` file and close out the loop.

```sh
    echo "terraform state mv $line[1] $replaced_line" >> script.sh
  done
}
```

What we end up with is a file that looks like so:

![terraform-state-mv](/images/bash-terraform-state-mv.png)

If you look closely, after the `terraform state mv`, we're moving the resource from `module.infra.module.*` to `module.*`.

To run this script we just type `modify_state` from a terminal window. After we run the generated script, the state will match what it should look like if the template module didn't exist. When we run `terraform apply` it should be a no-op assuming we haven't added or removed any resources.
