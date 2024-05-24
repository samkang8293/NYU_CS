## final project details
* you will not be graded on aesthetics
    * how ur site looks
    * "completeness" based on ur original goals
        * adjust read me to mention that x or y feature will not be implemented
## vite
* build tool (esbuild and babel under hood)
* serve our application via development server

`npm create vite@latest`

* install vite
* prompt u for values

`npm run dev`

* run the dev server
* serve the compiled js/jsx files
* entry point is still index.html

`npm run dev -- --port 3000`

components
* bundles of html and 'behavior'
* these components can be reused
* components can have data: props and state

create a component:
1. make a function, function should start w/ uppercase (think of)
2. optional argument (props)
3. must return single react element (jsx, createElement)
    * u can return array of elements
    * can wrap in react fragment <></>
once you've created component
* use as if they were custom tags or elements (must self close)
* <MyComponent/>

props
* data handed down to compoent from renderer or from parent
* created by usoing attributes `<MyComponent foo="bar">`
* props are accessed via single parameter of component

deprecated method of creating components
* classes
* dara (properties)
* action (methods)
* override methods to implement an interface

maps well w/ components
* data for component is instance variable
* override methods to call methods on component mount, render, lifecycle events

dpes not work well with functions
react hooks
* add functionality to components
* persistent data
* calling functions as side effects
* referencing dom elements
* (many things u can't do w/ regular functions)
* pattern: useX where X is hook u want to work with
* useState --> persistent data

`useState`
* single param: inital value of state
* returns array
    * 1st elem is way to access current val of state
    * 2nd elem is function to set new value of state
        * param to this function can be:
            * value/expression that resolves to value
            * function (that takes told state and returns new state)
        * this is async (so set does not immediately occur, will def happen before next rerender)
* value persists between component re=render (calling func again)
* u can have multiple useState calls in ur component 
* state must be at top level of component (not in conds, loops, inner funcs, etc.)

binary to decimal
* multiple components (parent child relationship)
    * move all state to 'parent' component
    * parent will push state down to children using props (name=value)