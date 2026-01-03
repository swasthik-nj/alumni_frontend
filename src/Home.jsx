import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Award, Target, Lightbulb, Network, BookOpen, ArrowRight, MapPin, Clock, ChevronLeft, ChevronRight, Wind } from 'lucide-react';
import { AuthContext } from './contexts/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function Home() {
  const { user, logout, loading } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
 // Countdown Timer Effect
 
  useEffect(() => {
    const targetDate = new Date('2026-01-01T10:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const stats = [
    { number: '45,568', label: 'Total Alumni', icon: Users },
    { number: '8,356', label: 'Active Members', icon: TrendingUp },
    { number: '941', label: 'Events Hosted', icon: Calendar },
    { number: '678', label: 'Scholarships', icon: Award }
  ];

  const benefits = [
    { icon: Network, title: 'Networking', description: 'Connect with fellow alumni across industries and generations' },
    { icon: Users, title: 'Strong Together', description: 'Build lasting relationships and collaborative opportunities' },
    { icon: Award, title: 'Achievement', description: 'Celebrate success stories and milestone achievements' },
    { icon: Lightbulb, title: 'Learning', description: 'Access continuous learning and development resources' },
    { icon: Target, title: 'Big Rewards', description: 'Exclusive benefits and rewards for active members' },
    { icon: BookOpen, title: 'Professional', description: 'Career advancement and professional growth support' }
  ];

  const jobs = [
    { company: 'Figma', position: 'Brand Designer', type: 'Freelance', salary: '$30k - $35k', location: 'Madrid, Spain', logo: '🎨', color: 'bg-purple-100 text-purple-600' },
    { company: 'Upwork', position: 'Data Marketing Analyst', type: 'Full-time', salary: '$40k - $45k', location: 'California, USA', logo: '📊', color: 'bg-green-100 text-green-600' },
    { company: 'Google', position: 'Interactive Developer', type: 'Part-time', salary: '$25k - $30k', location: 'London, UK', logo: '🔍', color: 'bg-red-100 text-red-600' },
    { company: 'Microsoft', position: 'Product Designer', type: 'Full-time', salary: '$35k - $40k', location: 'New York, USA', logo: '💼', color: 'bg-blue-100 text-blue-600' }
  ];

  const news = [
    { image: '/api/placeholder/400/250', date: 'December 13, 2022', category: 'Education', title: 'Things to know about the campus before starting college' },
    { image: '/api/placeholder/400/250', date: 'December 13, 2022', category: 'Education', title: 'Why you should avoid public housing for your children' },
    { image: '/api/placeholder/400/250', date: 'December 13, 2022', category: 'Education', title: 'How to maximize productivity with new approaches' }
  ];

 

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-200 via-blue-300 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-blue-950">
                Find your career opportunities with the  Community
              </h1>
              <p className="text-xl mb-8 text-black">
                Connect, grow, and succeed with thousands of alumnis
              </p>
              
            </div>
            
            <div className="relative">
              <img src="https://png.pngtree.com/png-vector/20250110/ourmid/pngtree-alumni-reunion-design-ideas-png-image_14358439.png" alt="Graduates"  />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-sky-600   bg-opacity-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8  text-indigo-950">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">24</div>
                <div className="text-emerald-100 text-sm">Years of service and dedication</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">128</div>
                <div className="text-emerald-100 text-sm">Comprehensive areas of study</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-4xl font-bold mb-1">300</div>
                <div className="text-emerald-100 text-sm">Success Stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Meetup Section */}
      <section className="py-20 bg-slate-300">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Annual Meetup & Scholarship Presentation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join us for our biggest event of the year, celebrating achievements and supporting future generations</p>
          </div>
          
          <div className="gap-8 items-center w-full relative">
            <div>
              <img src="https://images.pexels.com/photos/7944238/pexels-photo-7944238.jpeg" alt="Students" className='brightness-30 h-64 sm:h-80 md:h-96 lg:h-[25rem] w-full object-cover' />
            </div>
            
            <div className="bg-sky-700 text-white py-4 sm:py-6 absolute top-4 left-4 right-4 sm:top-10 sm:left-10 sm:right-auto md:top-20 md:right-20 md:left-auto rounded-2xl w-auto sm:w-96 md:w-[25rem] shadow-xl">
             
              <div className='grid grid-cols-4 gap-2 sm:gap-4 item-center px-4 sm:px-6 mb-4 sm:mb-6'>
                <div className='flex flex-col text-center'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{String(timeLeft.days).padStart(2, '0')}</h1>
                  <p className='text-xs sm:text-sm opacity-80'>Days</p>
                </div>
                <div className='flex flex-col text-center'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{String(timeLeft.hours).padStart(2, '0')}</h1>
                  <p className='text-xs sm:text-sm opacity-80'>Hours</p>
                </div>
                <div className='flex flex-col text-center'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{String(timeLeft.minutes).padStart(2, '0')}</h1>
                  <p className='text-xs sm:text-sm opacity-80'>Minutes</p>
                </div>
                <div className='flex flex-col text-center'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{String(timeLeft.seconds).padStart(2, '0')}</h1>
                  <p className='text-xs sm:text-sm opacity-80'>Seconds</p>
                </div>
                </div>
                <hr className='w-4/5 mx-auto pb-3 sm:pb-5'/>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 w-full px-4 sm:px-6">
                <div className='flex flex-col text-center sm:text-left'>
                  <h1 className='text-sm sm:text-base font-semibold'>Jan 01th, 2026</h1>
                  <p className='font-sans text-amber-50/50 text-[10px] sm:text-xs'>Monday from 10:00 AM to 4:00 PM</p>
                </div>
                <Link to={'/events'} className="px-4 sm:px-6 py-2 bg-white text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition text-sm sm:text-base whitespace-nowrap">
                Register Now
              </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join Alumni Connect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the benefits of being part of our thriving alumni community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-8 rounded-xl hover:shadow-lg transition border border-gray-400">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-sky-800 rounded-full mb-6">
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      <section className="py-20 bg-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-sky-800 rounded-full mb-4">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    

      {/* <section className="py-20 bg-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Career Opportunity</h2>
            <p className="text-gray-600">Explore exclusive job openings from our alumni network</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${job.color} rounded-lg flex items-center justify-center text-2xl`}>
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.position}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-sky-700 text-xs rounded-full font-medium">
                    {job.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="font-semibold text-gray-900">{job.salary}</span>
                </div>
                
                <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky  -700 transition font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonial Section */}
     



      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Don't miss our weekly updates about  alumni story</h2>
          <p className="text-gray-400 mb-8">Stay connected with the latest news, events, and opportunities</p>
          
         
        </div>
      </section>
      <Footer />
      </div>
    </div>
  );
}