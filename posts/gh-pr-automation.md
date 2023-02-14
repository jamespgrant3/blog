---
layout: post
title: "automate creating a pull request using the github cli"
tags: [git, automation, productivity]
date: '2023-01-29'
---
Did you know that github has a cli? I didn't for a while, but once I found out I started automating every interaction with the tool. My goal is to stay within tmux as much as possible. I'm faster with my fingers, less switching = more productivity.

You can find the instructions to install the cli [here](https://github.com/cli/cli#installation). Next, I would recommend [creating a github team](https://docs.github.com/en/organizations/organizing-members-into-teams/creating-a-team) within the organization. This allows us to assign the reviewer of the pull request to a team. Within github, you can assign users to the team.

Now, we just need to create scripts to automate the work. You can use the following command to learn about the parameters I will be using: `gh pr create --help`.

When automating, I try to use acronyms that make sense to me. I do not want to have to struggle to remember it. `cpr`, means just that...create pull request. If I want to set attributes on the pull request, I append them. So a draft pull request is the same acronym, but with a `d` at the end. `cprd`, create pull request draft.

Within the zsh shell, you can create a function and it is executable just like a command. You can also pass parameters. Each parameter is assigned a number, starting with `1`. To reference the first parameter in the script: `$1`, second `$2`.

Now, let's create our first script: creating a pull request.

```sh
# create pull request
# $1 base branch
# $2 title
# $3 body
cpr() {
  gh pr create \
  -B $1 \
  -r "mycompany/pull-request-approvers" \
  -a "@me" \
  -t $2 \
  -b $3
}
```
This script accepts three parameters. The base branch, which is the branch you are merging into, the title of the pull request, and the body of the pull request. What you get for free, is who the pull request is assigned to as the reviewer and the assignee. `@me` assigns the pull request to you.

Usage would look something like this, assuming you were merging into the `master` branch:

```sh
cpr master "the title of the pull request" "the body of the pull request"
```

Want to create a draft pull request? It's the  same command, just append the `--draft` parameter. It would look like this:

```sh
# create pull request draft
# $1 base branch
# $2 title
# $3 body
cprd() {
  gh pr create \
  -B $1 \
  -r "mycompany/pull-request-approvers" \
  -a "@me" \
  -t $2 \
  -b $3 \
  --draft
}
```

Usage:
```sh
cprd master "the title of the pull request" "the body of the pull request"
```

This saves me so much time in my daily flow. In times when I have been sharing my screen, folks often don't believe a pull request has been created...it happens that fast ;)

I hope this helps you as much as it has me.
