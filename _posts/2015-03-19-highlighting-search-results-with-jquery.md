---
layout: post
title: Highlighting Search Results with jQuery
---
Example on Page:
![Screenshot of  final result on page]({{ base.url }}/assets/jquery-highlight-example.png)
[Skip to the code](#jquery_code)

## Make your search user-friendly

Searching is key a function of almost every site you use, and every site you will ever build. For some sites, the search functionality can be the difference between keeping a user or losing them to a competitor. [Google's](http://www.google.com) only function is search, and they're worth over [$300 Billion](http://www.macroaxis.com/invest/ratio/GOOG--Current-Valuation). It's important to make your search as user-friendly as possible.

A great example of extremely user-friendly search is [Product Hunt](http://www.producthunt.com/). They use [Algolia](https://www.algolia.com/), which provides simple fuzzy matching, real-time results, and highlights the matching words on the page. Their pricing is steep for low-budget projects, but it's simple to implement your own matching word highlighting!

## Implementation

First, we need to grab what the user searched and break it up into individual words. This helps with basic fuzzy matching. Otherwise, it would have to find an exact match of what the user typed in the search box. This is easy in JavaScript:

``` javascript
// Maps "Test Search" to ["Test", "Search"]
var words = $('#search-field').val().trim().split(/\s+/);
```

Then, we need to find the search terms on the page. The jQuery [`:contains`](http://api.jquery.com/contains-selector/) selector is great for this, so we need to [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) our `words` array into a jQuery selector.

``` javascript
// Maps ["Test", "Search"] to ":contains(Test), :contains(Search)"
var query_string = words.map(function(word) {
	return ":contains(" + word + ")";
}).join(', ');
```

Now we have everything setup to grab the DOM elements that match our query. I ran a [jsPerf benchmark](http://jsperf.com/jquery-contains-one-vs-multiple) to see the most effecient way of running this query and this was the best by far. This assumes you have your search results as a child of a `li` element, but this can easily be rewritten with `td`, or whatever you have it in.

``` javascript
var all_items = $('li');
var matching_items = all_items.children(query_string);
```

Almost there! We have all of our matching search results, we just need to do the highlighting! Unfortunately, this is the hardest part. We can use a regex `replace` to wrap the search terms with a span that will highlight them on the page.

The regex will be generated from `words`, the array we had above that held the words the user searched for. We will use the `g` (global), and `i` (case-insensitve) flags so that the regex will replace all matches in the string, regardless of case.

``` javascript
// Maps ["Test", "Search"] to /Test|Search/gi
var regex = RegExp(words.join('|'), 'gi');
```

Then, we use this regex to find our search terms, and wrap them with a span with the class `highlight`, which we will define to give them a background color. The `$&` will be replaced with the matched text.

``` javascript
// Maps "Test" in DOM to "<span class='highlight'>Test</span>"
matching_items.each(function(_, item) {
	var j_item = $(item);
  j_item.html(j_item.html().replace(
			regex, "<span class='highlight'>$&</span>"
	));
});
```

For the `highlight` class:

``` css
.highlight {
	background-color: #2ecc71;
}
```

<span id="jquery_code">The final code:</span>

``` javascript
// Maps "Test Search" to ["Test", "Search"]
var words = $('#search-field').val().trim().split(/\s+/);

// Maps ["Test", "Search"] to ":contains(Test), :contains(Search)"
var query_string = words.map(function(word) {
	return ":contains(" + word + ")";
}).join(', ');

var all_items = $('li');
var matching_items = all_items.children(query_string);

var regex = RegExp(words.join('|'), 'gi');

// Maps "Test" in DOM to "<span class='highlight'>Test</span>"
matching_items.each(function(_, item) {
	var j_item = $(item);
    j_item.html(j_item.html().replace(
		regex, "<span class='highlight'>$&</span>"
	));
});
```

## Gotchas

You might notice if you try to use this, it is case-sensitive. This is because `:contains` is case-sensitive. To get around this, we have to write our own case-insensitive `:containsi`. I borrowed this code from [this StackOverflow post.](http://stackoverflow.com/questions/187537/is-there-a-case-insensitive-jquery-contains-selector)

``` javascript
$.extend($.expr[':'], {
  'containsi': function(elem, i, match, array)
  {
    return (elem.textContent || elem.innerText || '').toLowerCase()
    .indexOf((match[3] || "").toLowerCase()) >= 0;
  }
});
```

Then just replace the `:contains` above with `:containsi`.
