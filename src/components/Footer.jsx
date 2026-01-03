import React from 'react'

export default function Footer() {
  return (
    <div>
         {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4"> Alumni System</h3>
              <p className="text-sm mb-4">Connecting generations of graduates worldwide</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">f</a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">t</a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">in</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Mission</a></li>
                <li><a href="#" className="hover:text-white transition">History</a></li>
                <li><a href="#" className="hover:text-white transition">Leadership</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Directory</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
                <li><a href="#" className="hover:text-white transition">Mentorship</a></li>
                <li><a href="#" className="hover:text-white transition">Career Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 info@einna.edu</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 University Ave, City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Alumni System. All rights reserved.</p>
            <p className='p-3'>Developed by <a href="https://swasthik-nj-portfolio.vercel.app/" target='_blank'>Swasthik N J</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
