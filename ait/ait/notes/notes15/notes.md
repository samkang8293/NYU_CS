CSS property: position
* static ("Not positioned", default)
* relative (relative to where it usually be)
* fixed (relative to view port)
* absolute (relative to nearest enclosing position ancestor)

## attritbutes 
element.attributeName: read and write
const a = document.querySelector('a') // querySelectorAll
a.href = '/'

some attributes are not named the same (e.g. )

<section class ="hello">
// retrieve section
section.className

element.getAttribute(name)
element.setAttribute(name, value)
element.hasAttribute(name, value)

<script defer></script>

## timing functions
* functions that allow u to call another fn after some number of ms (milliseconds)
* most are aavailabel in node
* window.requestAnimationFrame
    * call that func at num of ms required to meet smooth animation for refresh rate of your display
    * func that u pass in will "draw"/animate 
* setTimeout (avail in node)
* setInterval

## basic css selectors
elementName - all elements with this name
.className - all elements with this class
#idName - all elements with this id

combining above

div.foo - all div elements with class foo
.foo.bar - all div elements w/ class foo and bar <a class = "foo bar baz">

relationships

* div a - any a nested within a div (at any depth)
* div > a - any a that is a direct descendent of a div
```
<div><a> MATCH
<div><section><a> no match
```
* span + a - any a that's a sibling of a span

other

h1, h2 --- select either h1s or h2s

width: 50px?
content? content + margin?
degault is width of content (does not include padding and border)

## units
1. 