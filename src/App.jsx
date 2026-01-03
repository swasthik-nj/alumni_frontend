import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Home from './Home'
import Login from './components/Login'
import Register from './components/Register'
import Personal from './components/Personal'
import Event from './components/Event'
import Directory from './components/Directory'
import Donate from './components/Donate'
import Admin from './components/Admin'
import Community from './components/Community'
import Contact from './components/Contact'



function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
    <Toaster position="top-center" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/directory" element={<Directory />} />

      //Authenticated user route
      <Route path="/personal" element={<Personal />} />
      <Route path="/events" element={<Event/>} />
      <Route path="/donate" element={<Donate/>} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />

    </Routes>
   </BrowserRouter>
  )
}

export default App
