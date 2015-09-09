---
layout: post
title: Automatically Generating Ctags with Git Hooks
---

As an avid Vim user, I am always searching for faster ways to do things.
When I learned about the amazing power of [Ctags](http://andrew.stwrt.ca/posts/vim-ctags/),
I was excited that I finally found a way to quickly move to the definition of a method or class.
I generated my Ctags once, and then I was fine for a while. But then, after the code changed enough,
I would keep running into methods and classes that weren't in my tags, and therefore I couldn't
jump to their definition. This is where generating them automatically comes in handy.

While there are probably a ton of ways to automatically generate Ctags, my personal favorite now is
using Git hooks. [Git hooks](http://git-scm.com/docs/githooks) are basically little scripts that get
run after some event happens in Git. For example, the one I am going to use in this post is
`post-checkout`. This means the script is run every time you checkout a branch in Git.

Now that we know about Git hooks, all we need to do is add a line to some Git hooks to generate
Ctags whenever certain things happen in Git. I personally set it up to generate Ctags after I checkout
a branch in Git. This can be done in two simple and elegant lines of bash that you run from the root
of the git repo:

``` bash
  echo "ctags -R --languages=ruby ." > .git/hooks/post-checkout
  chmod +x .git/hooks/post-checkout
```

The first line writes the `ctags` command to the `post-checkout` Git hook file.
The second line just makes the post-checkout hook executable. Of course you can customize the options
for the `ctags` command as you please.

It's that simple! If you want to generate Ctags more often, you can just run the same two lines
above but replace `post-checkout` with whatever hook you want to use.
