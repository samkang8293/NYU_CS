Old way of making components
* use classes
* instantiating a class gives you object
    * persists data
    * methods may override methods to implement some functionality
        * if u implement x method, then u can specify what happens when a component first mounts
        * (u can tap into lifecycle events of component)
moving over to functional components
* functions can't persist data across function calls
    * (when component rerenders where does data go?)
* solution: useState react hook... persist data through rerender
    * changing state causess ur component to rerender
* useEffect... allows u to run a function on certain event:
    * like when component first mounts
    * when component renders
    * when some var changes within component

functional components... pure functions?
* if u have same input (props)... u should have same output
* sometimes side effects change things
    * fetch 
    * sync w/ external system
    * work directly with dom

__if u are using getelementbyid or queryselector or create element_.... consider reimplementing in jsx

## useEffect to retrieve initial data
it will call functions at the event u specif
* on mount
* on render
* on var change

useEffect(fn, depArray)

* `fn` is funct that u call during that event
* function can't be async
* (it should be function that returns funtions or nothing... not a promise)

depArray:
* ``: no arg.... on render
* `[]`: empty dependency array... on mount
* `[var1, var2]`: dep array w/ vars ... when vars change (and on mount)


## y useEffect for fetch

2 api end points ... each will send back a diff msg, but one is slow (2 sec slow)

msg: u pressed delayed 
[regular][delayed]
            👆

useEffect's first arg, the function, can optionally return a function
* returned function is clean up function
* use it to prevent setting state, abort a fetch, etc
* this is why first arg can't be sync
* clean up function is invoked on old effect when next effect runs

## input field with onChange event handle

## useRef
* data that doesn't cause a re-render
* OR reference to actual DOM element

creates an object that holds persistent data
to get at that data, use .current property

const myRef = useRef(5)
myRef.current //5