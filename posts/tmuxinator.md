---
layout: post
title: "tmuxinator"
tags: [vim, productivity, tmux]
date: "2023-02-04"
---

Are you crazy about a consistent tmux work environment? I am!! I have windows and panes in a certain way, per project. If they are not in that order, I lose my mind.
Who wants to have to recreate this setup every time they open a tmux session?
So thankful a friend introduced me to [tmuxinator](https://github.com/tmuxinator/tmuxinator) a long time ago.

tmuxinator allows you to create a configuration file, or project, that describes your tmux session. When you start your project, you get the same setup every time.

The first thing I did after install, because who wants to have to type `tmuxinator` all the time, is create an alias.

```sh
alias tx=tmuxinator
```

Now you can type `tx` to see a list of commands. Most useful are `list`, `new`, `edit`, `start`, and `stop`. All are pretty self explanatory, but the syntax is: `tx <command>`.

To get started, you'll want to run `tx new <project-name>`. A project yml file will be scaffolded for you. You can then create the configuration to your liking. The documentation in their repo is really well written, so I won't go into details here. Here is the tmuxinator project for the blog.

```sh
# /Users/james/.config/tmuxinator/blog.yml
name: blog
root: ~/repos/blog

windows:
  - editor:
      layout: main-vertical
      panes:
        - nv
        - js
```

I define the root as the `blog` directory, this is because any commands written in the configuration are run in the context of root.

You can have as many windows as you like, but for my blog I just have one window.
The window is titled editor, and it is split into two panes. The first pane is a `neovim` session. The second pane runs a `js` alias. No, it's not JavaScript, silly. This alias runs `jekyll serve`. So assuming docker desktop is running, I get a local instance of my blog running on port `4000`.

If you're a vim/tmux enthusiast, I highly encourage you to give tmuxinator a heavy look. For a small time investment, it can really save you time and headache.
