import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(69)

  return (
    <>
      <div className = "App">

        <button onClick={() => {setCount(count+1)}}>{count}</button>
      <h1>Hello world</h1>
      </div>
      
    </>
  )
}

export default App
