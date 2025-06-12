"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import CookieDisclaimer from "../components/CookieDisclaimer";

const MENU = [
  { label: "About", id: "about" },
  { label: "FLYREEL", id: "showreel" },
];

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string|null>(null);

  const handleScroll = (id: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      about: aboutRef,
      contact: contactRef,
    };
    refs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Thank you for your message! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setFeedback('Sorry, something went wrong. Please try again later.');
      }
    } catch (err) {
      setFeedback('Sorry, something went wrong. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden font-sans">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-transparent flex items-center justify-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Image src="/flyreel-logo.png" alt="Flyreel Logo" width={56} height={56} priority style={{objectFit: 'contain'}} />
          </div>
          <span className="ml-2 text-2xl font-extrabold tracking-widest text-white select-none" style={{letterSpacing: '0.15em'}}>FLYREEL</span>
        </div>
        <nav className="flex gap-8">
          <button className="text-white text-lg font-semibold hover:text-blue-300 transition" onClick={() => handleScroll('about')}>About</button>
          <button className="text-white text-lg font-semibold hover:text-blue-300 transition" onClick={() => handleScroll('contact')}>Contact</button>
        </nav>
      </header>
      {/* Hero Video Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden pt-0 pb-0" style={{minHeight: '100vh'}}>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/flyreel_landing_compressed.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Logo Overlay mit Fade-in Animation */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 animate-fadein">
          <Image 
            src="/flyreel-logo-hero.svg" 
            alt="Flyreel Hero Logo Overlay" 
            width={400} 
            height={400} 
            priority 
            style={{
              objectFit: 'contain',
              maxWidth: '60%',
              height: 'auto',
              filter: 'drop-shadow(0 4px 32px rgba(0,0,0,0.25))'
            }} 
          />
          <span style={{fontFamily: 'Montserrat, Nunito Sans, Work Sans, Arial, sans-serif'}} className="mt-6 text-2xl md:text-3xl font-light text-white tracking-wide text-center block">
            professional drone cinematography
          </span>
          {/* Play Button */}
          <button
            onClick={() => {
              // Create overlay
              const overlay = document.createElement('div');
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100vw';
              overlay.style.height = '100vh';
              overlay.style.zIndex = '100';
              overlay.style.background = 'rgba(0,0,0,0.95)';

              // Create video
              const video = document.createElement('video');
              video.src = '/flyreel_one_compressed.mp4';
              video.style.position = 'absolute';
              video.style.top = '0';
              video.style.left = '0';
              video.style.width = '100vw';
              video.style.height = '100vh';
              video.style.objectFit = 'cover';
              video.style.zIndex = '101';
              video.controls = false;
              video.autoplay = true;
              video.muted = false;
              video.volume = 1;
              video.loop = true;

              // Create back button
              const backBtn = document.createElement('button');
              backBtn.innerText = '← Back';
              backBtn.style.position = 'absolute';
              backBtn.style.top = '24px';
              backBtn.style.left = '24px';
              backBtn.style.zIndex = '102';
              backBtn.style.padding = '8px 20px';
              backBtn.style.fontSize = '1.1rem';
              backBtn.style.fontWeight = 'bold';
              backBtn.style.background = 'linear-gradient(90deg, #fff 0%, #f3f4f6 50%, #fff 100%)';
              backBtn.style.color = '#222';
              backBtn.style.border = 'none';
              backBtn.style.borderRadius = '9999px';
              backBtn.style.cursor = 'pointer';
              backBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
              backBtn.style.transition = 'background 0.2s, transform 0.2s';
              backBtn.onmouseenter = () => {
                backBtn.style.background = 'linear-gradient(90deg, #f3f4f6 0%, #fff 100%)';
                backBtn.style.transform = 'scale(1.05)';
              };
              backBtn.onmouseleave = () => {
                backBtn.style.background = 'linear-gradient(90deg, #fff 0%, #f3f4f6 50%, #fff 100%)';
                backBtn.style.transform = 'scale(1)';
              };
              backBtn.onclick = () => {
                overlay.remove();
              };

              overlay.appendChild(video);
              overlay.appendChild(backBtn);
              document.body.appendChild(overlay);
              video.play();
            }}
            className="mt-12 px-8 py-3 text-xl font-bold text-gray-900 bg-gradient-to-r from-white via-gray-200 to-white rounded-full transition-all duration-600 shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-300 hover:via-apricot-300 hover:to-blue-300"
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Play Flyreel
          </button>
        </div>
      </section>
      {/* About Section (hidden when overlay is open) */}
      <section ref={aboutRef} id="about" className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-32 bg-white" style={{fontFamily: 'Montserrat, Nunito Sans, Work Sans, Arial, sans-serif'}}>
        <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-16 text-center tracking-wide">We Elevate Your Vision</h2>
        
        {/* Two-column layout */}
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-[400px] lg:h-[500px] overflow-hidden">
              <Image 
                src="/drone-image.jpg" 
                alt="Professional drone cinematography" 
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
              />
            </div>
          </div>
          
          {/* Text Column */}
          <div className="w-full lg:w-1/2">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Flyreel produces high-quality aerial visuals that enhance your story by combining advanced drone technology with creative expertise. Our team is experienced in professional drone cinematography, offering dynamic first-person view footage and aerial shots that present your location from fresh perspectives.
              <br /><br />
              <span className="font-semibold text-gray-800">We elevate your vision through our  network of skilled professionals</span> – including filmmakers, producers, sound designers, social media managers, and web designers – we support your project from concept to final cut. We focus on every detail to ensure your story is told with clarity and cinematic quality.
            </p>
            
            {/* Cooperation Text with inline logo */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-8 flex items-baseline flex-wrap">
              in partnership with{' '}
              <a 
                href="https://www.somniafilm.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-baseline ml-2 hover:opacity-80 transition-opacity duration-200"
              >
                <Image 
                  src="/somniafilm-logo.avif" 
                  alt="Somniafilm" 
                  width={120}
                  height={24}
                  style={{
                    height: '1.4rem', // Slightly smaller for better alignment
                    width: 'auto',
                    objectFit: 'contain',
                    verticalAlign: 'baseline',
                  }}
                  className="inline-block"
                />
              </a>
            </p>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="min-h-[60vh] flex flex-col items-center justify-center px-2 py-32 w-full" style={{fontFamily: 'Montserrat, Nunito Sans, Work Sans, Arial, sans-serif', background: 'linear-gradient(120deg, #f7f8fa 80%, #eceff3 100%)'}}>
        <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-12 text-center tracking-wide">Contact</h2>
        <div className="text-xl md:text-2xl text-gray-700 mb-12 text-center whitespace-pre-line">
          Kastanienallee 26
          <br />74670 Forchtenberg
          <br />Germany
        </div>
        <a
          href="mailto:info@flyreel.art"
          className="mt-8 px-6 py-2 text-lg font-bold text-white bg-black rounded-full transition-all duration-600 shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-300 hover:via-apricot-300 hover:to-blue-300"
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          Get in touch
        </a>
        
      </section>
      
      {/* Google Maps iframe - Full Width, No Transformation Issues */}
      <section className="w-full bg-gray-50">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2602.6629061787507!2d9.549072977007965!3d49.2827843707463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47983ff12b10b431%3A0xd485be0c1b6ebb50!2sKastanienallee%2026%2C%2074670%20Forchtenberg!5e0!3m2!1sde!2sde!4v1749568363798!5m2!1sde!2sde" 
          width="100%" 
          height="600" 
          style={{
            border: 0,
            display: 'block',
            filter: 'saturate(0) contrast(1.15) brightness(1.05)',
          }} 
          allowFullScreen={true}
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </section>
      
      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-6 py-2 text-xs text-gray-300 bg-[#23272f]/80 border-t border-gray-800 relative backdrop-blur-md shadow-lg">
        <span>© 2025 Flyreel</span>
        <div className="absolute right-4 bottom-2 flex gap-4">
          <a href="/datenschutz" className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors duration-200" style={{opacity:0.7}}>Privacy Policy</a>
          <a href="/imprint" className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors duration-200" style={{opacity:0.7}}>Imprint</a>
        </div>
      </footer>
      
      {/* Cookie Disclaimer */}
      <CookieDisclaimer />
      {/* Gradient Animation Keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease-in-out infinite;
        }
      `}</style>
      <style jsx>{`
        button:hover {
          background-position: right;
        }
      `}</style>
    </main>
  );
}
