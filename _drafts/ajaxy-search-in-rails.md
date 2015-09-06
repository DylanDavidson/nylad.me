---
layout: post
title: Ajaxy Search in Rails
---

## Seriously, make your search user-friendly

I talked in my [last post](/2015/03/19/highlighting-search-results-with-jquery/) about how important
it is to make searching on your site user-friendly. There are a lot of elements that go into making
it easy to use, which often makes it difficult to implement in full. This is probably why so many
sites seem to get it wrong. To me, one of the most important elements is giving the user quick results.
This is what makes Google so powerful, and so many other sites easy to use. While quick page load
times are important, I think the best option is no new page loading at all. This means instant results
as you're typing, just like Google's [instant results](https://support.google.com/websearch/answer/186645?hl=en).

## The myth of AJAX

I think that a lot of Rails developers are afraid of AJAX and even JavaScript in general. It can be
a pretty scary beast to tackle sometimes, but things like [CoffeeScript](http://coffeescript.org/)
and [jQuery](https://jquery.com/) have made some of the hard work much easier. This includes AJAX,
with the [`$.ajax()`](http://api.jquery.com/jquery.ajax/) helper method that jQuery gives us.

## Coding it all up

Our goal is to create an index page of posts (since posts seem to be a theme for [Rails tutorials]())
