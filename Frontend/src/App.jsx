import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Chat from './chat'
import VirtualAssistant from './virtualAssistant'

function App() {
  return (
    <>
      <div className='bg-gradient-r from-green-950 to-blue-950'>
        <Router>
          <Routes>
            <Route path='/' element={<VirtualAssistant/>}/>
            <Route path='/chat' element={<Chat/>}/>
          </Routes>
        </Router>
      </div>
        
    </>
  )
}

export default App
