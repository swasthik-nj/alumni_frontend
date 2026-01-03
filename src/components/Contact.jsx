import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just show a success toast and clear the form
      // You can integrate with a backend endpoint or email service later
      toast.success('Message sent! We will contact you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-emerald-100">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Email</h3>
            </div>
            <p className="text-emerald-700">contact@alumni-system.com</p>
            <p className="text-emerald-700">support@alumni-system.com</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Phone</h3>
            </div>
            <p className="text-emerald-700">+91 (555) 123-4567</p>
            <p className="text-emerald-700 text-sm">Mon - Fri, 9 AM - 6 PM</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Address</h3>
            </div>
            <p className="text-emerald-700">Alumni Hub, Main Street</p>
            <p className="text-emerald-700">Your City, State 12345</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-900 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-emerald-900 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-900 text-sm font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="+91 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-emerald-900 text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-emerald-900 text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                placeholder="Tell us what's on your mind..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 cursor-pointer">
              <summary className="font-semibold text-emerald-900">
                What is the typical response time?
              </summary>
              <p className="text-emerald-700 mt-2">
                We aim to respond to all inquiries within 24-48 hours during business days.
              </p>
            </details>

            <details className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 cursor-pointer">
              <summary className="font-semibold text-emerald-900">
                Can I report a technical issue?
              </summary>
              <p className="text-emerald-700 mt-2">
                Yes, please use the contact form to describe the issue in detail. Include screenshots if possible.
              </p>
            </details>

            <details className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 cursor-pointer">
              <summary className="font-semibold text-emerald-900">
                How do I update my profile information?
              </summary>
              <p className="text-emerald-700 mt-2">
                Log in to your account, navigate to your profile, and click the Edit button to update your information.
              </p>
            </details>

            <details className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 cursor-pointer">
              <summary className="font-semibold text-emerald-900">
                Is my data secure?
              </summary>
              <p className="text-emerald-700 mt-2">
                Yes, we use industry-standard encryption and follow best practices to protect your personal information.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
