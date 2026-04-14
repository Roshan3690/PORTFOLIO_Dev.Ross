'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import MagneticWrap from './MagneticWrap';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const formData = new FormData(event.currentTarget);
    
    // Replace this string with your Web3Forms access key
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';
    formData.append('access_key', accessKey);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        // @ts-ignore
        event.target.reset(); // Clear the form
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds if success
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
        <div className="relative group">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="w-full bg-surface-800/80 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-accent/50 focus:bg-surface-800 transition-all duration-300"
          />
        </div>
        
        <div className="relative group">
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="w-full bg-surface-800/80 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-accent/50 focus:bg-surface-800 transition-all duration-300"
          />
        </div>
        
        <div className="relative group">
          <textarea
            name="message"
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full bg-surface-800/80 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-accent/50 focus:bg-surface-800 transition-all duration-300 resize-none"
          ></textarea>
        </div>

        {/* Hidden Honeypot to prevent spam */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

        <div className="mt-4 flex justify-center">
          <MagneticWrap strength={0.15}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative inline-flex items-center justify-center gap-3 px-10 py-4 font-heading font-bold text-base rounded-full overflow-hidden transition-all duration-300 ${
                status === 'success' 
                  ? 'bg-green-500 text-white' 
                  : status === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-accent text-black hover:shadow-[0_0_40px_rgba(167,139,250,0.4)]'
              }`}
              data-cursor-hover
            >
              <div className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                    />
                    Sending...
                  </span>
                ) : status === 'success' ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Sent!
                  </span>
                ) : status === 'error' ? (
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Error
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:-mt-1 group-hover:ml-1 transition-all" />
                    Send Message
                  </>
                )}
              </div>
              
              {status === 'idle' && (
                <span className="absolute inset-0 bg-accent-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              )}
            </button>
          </MagneticWrap>
        </div>
      </form>
    </div>
  );
}
