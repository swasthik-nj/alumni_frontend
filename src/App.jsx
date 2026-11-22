import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Toaster as SonnerToaster } from 'sonner'
import './App.css'
import Home from './Home'
import Login from './components/Login'
import Register from './components/Register'
import Personal from './components/Personal'
import StudentProfile from './components/StudentProfile'
import StudentMentorshipDashboard from './components/StudentMentorshipDashboard'
import MentorshipExplore from './components/MentorshipExplore'
import MentorshipRequests from './components/MentorshipRequests'
import MentorshipChat from './components/MentorshipChat'
import Event from './components/Event'
import Directory from './components/Directory'
import Donate from './components/Donate'
import Admin from './components/Admin'
import Community from './components/Community'
import Contact from './components/Contact'
import Gamification from './components/Gamification'
import SmoothScroll from './components/SmoothScroll'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <SonnerToaster position="top-right" richColors closeButton />
      <SmoothScroll>
        <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/directory" element={<Directory />} />

      //Authenticated user route
      <Route path="/personal" element={<Personal />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/mentorship-dashboard" element={<StudentMentorshipDashboard />} />
      <Route path="/mentorship/explore" element={<MentorshipExplore />} />
      <Route path="/mentorship/requests" element={<MentorshipRequests />} />
      <Route path="/mentorship/chat/:requestId" element={<MentorshipChat />} />
      <Route path="/events" element={<Event/>} />
      <Route path="/donate" element={<Donate/>} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gamification" element={<Gamification />} />

        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  )
}

export default App
