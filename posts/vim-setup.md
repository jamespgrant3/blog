---
title: "vim configuration"
tags: [vim, zsh, productivity]
date: "2023-01-28"
---

### vim configuration

I follow the theprimeagen pretty hard, on [all of his platforms](https://linktr.ee/ThePrimeagen). Yes, I liked, subscribed, and turned notifications on...on EVERY platform. It's really bad. But the time really is time well spent.

This guy is brilliant. He covers a lot of great engineering principles, but he's also a diehard vim fan, like my person. He did an absolute amazing [neovim configuration talk](https://www.youtube.com/watch?v=w7i4amO_zaE).

My [old repo](https://github.com/jamespgrant3/dotfiles) is just littered with configuration files. It still is for some things, but what you won't find is any vim configuration. My new setup has all been pushed [here](https://github.com/jamespgrant3/nvim-lua). The entire configuration is Lua-based. The code > configuration approach really simplifies the setup.

I no longer have to symlink my `.vimrc` from my repo to where vim expects it to be. After getting everything setup on my personal machine, I pushed the changes to my repo, pulled them down on my work machine....and IT JUST WORKED!! Saved so much time.

### zshrc configuration

Another change I made recently was around my `.zshrc` file. I use my personal machine as a base `.zshrc`. I'll make changes, push to the repo, pull on my work machine....and my environments are consistent.

This gets hard to manage, fast. On both machines, I symlink the `.zshrc` file from my repo to where zsh expects it. I'll add an `alias` or an `export` needed for work, and git will pick it up as a change. But, I don't want it to because this change is for work only. As I said, my personal machine is the base. So if I make a change there, I may want that on my work machine. So, I have to stash the `.zshrc` on my work machine...pull the change...then apply the stash and work through any conflicts. It's just an absolute mess.

I found out that zsh loads a `.zprofile` file. This is great. I can have environment-specific configuration between machines that git knows nothing about. I can even push these configs to a different repo.

On my personal machine, I did have some things that were not needed for work. So to prepare, I took the time to make a real base `.zshrc` file. Once this was done, I created a `.personal-zshrc` on my personal , and a `.work-zshrc` on my work machine. I created a `~/.zprofile` on both machines. All that file does is source the machine specific zshrc. Example of personal: `source ~/.personal-zshrc`. That's it, problem solved.

My work machines `.zprofile` sources several dotfiles. So, if I ever make a change to any file, I now source `~/.zprofile`, so all files are reloaded. It's just easier, less thinking.

If you have a better solution, please reach out to me. You can find all my contact information below.
