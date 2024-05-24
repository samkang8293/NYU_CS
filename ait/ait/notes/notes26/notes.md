## format
* similar to midterm
* ~50% coding challenge, ~50% mc, fib, t/f
* coding questions:
    * 2 separate questions
    * 1 x 2 part question (similar to the practice on ed lessons)
* mc, fib, t/f:
    * likely 2 to 3 sets of these, w/ number varying

topics
* cumulative in that u can't forget:
    * js (functions, map, ...)
    * express
    * http
* biased towards 2nd part of semester
    * starting from router objects/req.params all the way to react (but not including client side routing / react router or next.js, no custom hooks)
    * wat actual topics:
        * organizing code in routes
        * configuration using dotenv
        * authentication
        * tls/ssl
        * basic html/css
        * display, position
        * client js
        * DOM manipulation
        * event handling
            * default behaviors
        * js + CSS (.style, classList.add, etc.)
        * CSS selectors
        * background requests ... fetch (avoid using xhr), favor async and await rather than then
        * js timers
        * socket.io
        * react
        * react w/ hooks and fetch
    * not on exam:
        * client side routing
        * react router
        * xhr ... not explicitly on exam
* other topics to look at:
    * react ... react related libs: react router client side routing, swr or react quert for fetch...
    * typescript
    * next.js

then
[ ] renders a form
[ ] button is clickable
[ ] adding text and clicking result in new div

test taking strategies
* coding challenges
    * review hw
    * practice exam questions on ed lessons
    * reposted ed lessons quizzes
    * not all questions can be autograded
    * regardless... the priority is working code
        * build incrementally making sure:
            * individual tests are passing as u go along
            * u can click thru required interactions
        * e.g. working w/ react:
            * can i render a component
            * should i add data (state, ref, props)
            * add event listener
* conceptual questions
    * read code (read the posted notes, try to read ur code before running it)
    * slides

SOP
* governs what happens when there's a cross oriign request
* if it's a simple request
    * GET... content type is form-url-encoded
    * POST... content type is form-url-encoded
    * request can happen! ... response can come back, we can't read it from client side js
* if it's POST w/ application/json as content type
    * browser will send "pre flight" request before actual POST
    * OPTION request is sent ... and if we don't get back CORs headers, then don't send
    * original post!!!