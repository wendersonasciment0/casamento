import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NossaHistoria from './components/NossaHistoria';
import Local from './components/Local';
import ListaPresentes from './components/ListaPresentes';
import ConfirmarPresenca from './components/ConfirmarPresenca';
import NoivosLogin from './components/NoivosLogin';
import NoivosPainel from './components/NoivosPainel';
import Footer from './components/Footer';
import { WeddingInfo } from './types';

export default function App() {
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch wedding configuration from the server
  const fetchWeddingInfo = async () => {
    try {
      const res = await fetch('/api/wedding-info');
      const data = await res.json();
      if (data.info) {
        setWeddingInfo(data.info);
      }
    } catch (e) {
      console.error('Error fetching wedding info:', e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-login if PIN is already stored in localStorage
  const checkAutoLogin = async () => {
    const savedPin = localStorage.getItem('adminPin');
    if (savedPin) {
      try {
        const res = await fetch('/api/wedding-info/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pin: savedPin })
        });
        const data = await res.json();
        if (data.success) {
          setIsAdmin(true);
          setAdminPin(savedPin);
        } else {
          localStorage.removeItem('adminPin');
        }
      } catch (err) {
        console.error('Auto login check failed:', err);
      }
    }
  };

  useEffect(() => {
    fetchWeddingInfo();
    checkAutoLogin();
  }, []);

  const handleLoginSuccess = (pin: string) => {
    setIsAdmin(true);
    setAdminPin(pin);
    setCurrentTab('noivos-painel');
  };

  const handleUpdateWeddingInfo = (updatedInfo: WeddingInfo) => {
    setWeddingInfo(updatedInfo);
    // Re-fetch from Supabase to ensure local state reflects persisted data
    fetchWeddingInfo();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif italic text-charcoal/60 text-lg">Preparando Celebração...</p>
      </div>
    );
  }

  // Fallback defaults if server info has not resolved yet
  const info: WeddingInfo = weddingInfo || {
    noivaName: 'Letielly',
    noivoName: 'Wenderson',
    weddingDate: '2026-11-14',
    weddingTime: '16:30',
    venueName: 'Espaço Província',
    venueAddress: 'Rua das Oliveiras, 100 - Bosque Imperial',
    venueCity: 'Nova Lima - MG',
    venueMapUrl: 'https://maps.google.com',
    ourStory: 'Nossa história começou há alguns anos e cresceu com cumplicidade, amizade e amor. Hoje, estamos ansiosos para selar nosso compromisso diante de Deus e dos nossos familiares.',
    ourStoryImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    pixKey: 'letiellyewenderson@casamento.com.br',
    pixHolder: 'Letielly S. Silva',
    adminPin: '1234'
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenLogin={() => setIsLoginOpen(true)}
        noivaName={info.noivaName}
        noivoName={info.noivoName}
      />

      {/* Main content viewport */}
      <main className="flex-grow">
        
        {/* Render Private Dashboard View */}
        {currentTab === 'noivos-painel' && isAdmin ? (
          <NoivosPainel
            adminPin={adminPin}
            weddingInfo={info}
            onUpdateWeddingInfo={handleUpdateWeddingInfo}
            onNavigateToTab={setCurrentTab}
          />
        ) : (
          /* Render Public-Facing Pages */
          <>
            {currentTab === 'inicio' && (
              <div className="animate-fade-in">
                <Hero
                  noivaName={info.noivaName}
                  noivoName={info.noivoName}
                  weddingDate={info.weddingDate}
                  weddingTime={info.weddingTime}
                  venueName={info.venueName}
                  venueCity={info.venueCity}
                  onNavigateToRSVP={() => setCurrentTab('rsvp')}
                />
                <NossaHistoria
                  noivaName={info.noivaName}
                  noivoName={info.noivoName}
                  ourStory={info.ourStory}
                  ourStoryImageUrl={info.ourStoryImageUrl}
                />
                <Local
                  venueName={info.venueName}
                  venueAddress={info.venueAddress}
                  venueCity={info.venueCity}
                  venueMapUrl={info.venueMapUrl}
                  weddingDate={info.weddingDate}
                  weddingTime={info.weddingTime}
                />
                <ListaPresentes
                  weddingDate={info.weddingDate}
                  pixKey={info.pixKey}
                  pixHolder={info.pixHolder}
                  onPurchaseSuccess={fetchWeddingInfo}
                />
                <ConfirmarPresenca
                  weddingDate={info.weddingDate}
                  weddingTime={info.weddingTime}
                  venueName={info.venueName}
                />
              </div>
            )}

            {currentTab === 'historia' && (
              <div className="animate-fade-in">
                <NossaHistoria
                  noivaName={info.noivaName}
                  noivoName={info.noivoName}
                  ourStory={info.ourStory}
                  ourStoryImageUrl={info.ourStoryImageUrl}
                />
              </div>
            )}

            {currentTab === 'local' && (
              <div className="animate-fade-in">
                <Local
                  venueName={info.venueName}
                  venueAddress={info.venueAddress}
                  venueCity={info.venueCity}
                  venueMapUrl={info.venueMapUrl}
                  weddingDate={info.weddingDate}
                  weddingTime={info.weddingTime}
                />
              </div>
            )}

            {currentTab === 'presentes' && (
              <div className="animate-fade-in">
                <ListaPresentes
                  weddingDate={info.weddingDate}
                  pixKey={info.pixKey}
                  pixHolder={info.pixHolder}
                  onPurchaseSuccess={fetchWeddingInfo}
                />
              </div>
            )}

            {currentTab === 'rsvp' && (
              <div className="animate-fade-in">
                <ConfirmarPresenca
                  weddingDate={info.weddingDate}
                  weddingTime={info.weddingTime}
                  venueName={info.venueName}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Footer (Visible unless we are actively using the admin panel) */}
      {currentTab !== 'noivos-painel' && (
        <Footer noivaName={info.noivaName} noivoName={info.noivoName} />
      )}

      {/* Noivos Login Overlay/Dialog Popup */}
      <NoivosLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
