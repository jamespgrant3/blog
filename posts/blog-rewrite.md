---
layout: post
title: blog rewrite
tags: ["javascript"]
date: "2023-02-13"
---

This weekend, I took the time to rewrite my blog from Jekyll to NextJS.

The inspiration here was for DX, and maintainability.

As far as DX, I had to come to terms with my person. I am not a ruby developer. I don't dislike the language, I just don't want to have to relearn it every time I need to tweak the blog. The whole experience of making a post was flawed, in my opinion. I had to run Docker Desktop, which drained my battery. I ran Jekyll in a container, I never really understood how Jekyll was working. Because of this, I never added features.

User feedback would be nice, how can users make comments? In JS, I could implement this. In Jekyll, there are hacks. You can tie comments to GitHub issues, and load them using their API. But, are they really issues? Why constrain interactivity to just users with GitHub accounts?

Paginating the list of posts would be nice. I started implementing that using a Jekyll plugin and quickly started fighting a battle. Again, an experienced ruby developer could handle this. I didn't want to, if I had a choice.

I started reading about NextJS and static content. I loved how Jekyll supported markdown. I didn't want to have to rewrite all my posts. I started researching. I found a javascript package called [gray-matter](https://github.com/jonschlinkert/gray-matter) that could take my markdown file, and parse it into a JSON object. This helped me keep my markdown files. I could add metadata about the post, and its content (see [here](https://raw.githubusercontent.com/jamespgrant3/blog/master/posts/2023-02-06-practice-eks-thread.md)), convert it to JSON and use it in a view. Great!

I then found [showdown](https://github.com/showdownjs/showdown). Showdown was the icing on the ole cake. It did the conversion of markdown to html. With these two packages, I had most of the hard parts figured out.

The only other part I solved for, was tagging. I had to be able to tag posts, and pull posts by tag. I won't go into detail, but you can see the solution [here](https://github.com/jamespgrant3/blog/blob/master/lib/tags.js). It remains to be seen how this tagging solution scaled. I was able to see the benefits of the rewrite decision rather quickly.

It is a super plain look. After a lot of thought, I decided not to incorporate my favorite vim color scheme (dracula) into the blog this time around. I will do something with it....maybe? For now it will just be a clean look.

I am glad to have this rewrite behind me. I know how this blog works, I can do anything I want to it. No more containers. Development is just an `npm run dev` away. Each post is no longer a tech debt item.

I hope you got something out of this, even if it's just that anything is possible if you put your mind to it :)
