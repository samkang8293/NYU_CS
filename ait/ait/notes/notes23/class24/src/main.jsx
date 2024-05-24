import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const MyComponent = () => {

}
const root = ReactDOM.createRoot(document.getDocumentById('root'))

// const MyComponent = ({thing}) => {
//   return (
//     <section>
//       <h1>hello</h1>
//       <h2>{thing}</h2>
//     </section>
//   )
// }

// const root = ReactDOM.createRoot(document.getElementById('root'))
// // root.render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>,
// // )
// const div = <div className="foo">hello</div>
// // same as React.createElement('div', {className: 'foo'}, 'hello')
// root.render(<MyComponent/>)