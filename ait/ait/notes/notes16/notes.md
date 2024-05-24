## Code
* document.querySelector('.masthead')
* innerHTML - translate html code to be added to selected code
* can manipulate styles by using style properties
    * ex: m.childNodes[0].childNodes[0].style.color = 'red';
    * avoid using this for reading properties
## change the DOM
* modify text
    * get the text node and work with 'nodeValue'
    * 'textContent'
    * 'innerHTML'
* working with elements
    * document.createElement
    * element.appendChild
    * element.append(ele1, ele2, ...)
    * element.remove
* manipulating styles through js
    * .style property
    * access css properties from that
    * ele.style.color = 'red'
    * avoid reading from .style
    * "better" alternative ... classList and style by using CSS rules that target specific classes
    * classList
        * add - adds a class to that element
        * remove - removes that class
        * toggel - adds if not there, removes if present

goal: create client side app (served thru express static)

* no data store, everything is just in client side js and html

while(true) {
    ask button if pressed
    if pressed
        do something
}
javascript abstracts this away
* register a func / event listener for specific event
* when event occurs, that func is called
* we saw this on server side code, true for client as well

all nodes are event targets, which means that they have the ability to listen to an event

* `addEventListener`
* arguments
    1. the event name as a string (predefined names, 'click', 'mousemove', 'DOMContentLoaded)
    2. function to call
        * optional argument, evt (information abt the event that occurred)
            * x & y valyes if it's a click or mousemove
            * key code if it's a key press event
            * also has methods to control how event handling works
                * preventDefault --> stops the default action (e.g. will not submit form, or stop a link from making request, etc.)
                * stopPropagation --> prevent the event from bubbling up to parent/container event 
        * within this func
            * this refers to the element that generated the event
            * avoid using arrow functions for your cb to addEventListener

type="module"

* import in client sdie js
* auto defer that included js file
* if ur 