'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Inviare email (dopo)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navigation />

      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-5xl font-bold mb-12">Contatti</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Metodi di Contatto</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📧</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a href="mailto:moreno@example.com" className="text-blue-600 hover:underline">
                    moreno@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">🐙</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">GitHub</h3>
                  <a href="https://github.com/MorenoZuddas7" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    github.com/MorenoZuddas7
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">🏃</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Strava</h3>
                  <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Profilo Strava
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">📍</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ubicazione</h3>
                  <p className="text-gray-600">Cagliari, Sardegna, Italia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Invia un Messaggio</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="La tua email"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Messaggio</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Il tuo messaggio"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                Invia Messaggio
              </button>
            </form>

            {submitted && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✅ Messaggio inviato con successo!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}