import React, { useState } from 'react';
import { Menu, X, Heart, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  onOpenLogin: () => void;
  noivaName: string;
  noivoName: string;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAdmin,
  setIsAdmin,
  onOpenLogin,
  noivaName,
  noivoName
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'historia', label: 'Nossa História' },
    { id: 'local', label: 'O Local' },
    { id: 'presentes', label: 'Lista de Presentes' },
    { id: 'rsvp', label: 'Confirmar Presença' },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminPin');
    setCurrentTab('inicio');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-olive/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('inicio')}>
            <span className="font-serif italic text-2xl sm:text-3xl text-terracotta font-semibold tracking-wide">
              {noivaName} & {noivoName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`label-text text-xs tracking-widest transition-all relative py-2 px-1 ${
                    active ? 'text-terracotta font-semibold' : 'text-charcoal/70 hover:text-terracotta'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-terracotta rounded-full" />
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <button
                onClick={() => handleNav('noivos-painel')}
                className={`label-text text-xs tracking-widest transition-all relative py-2 px-1 ${
                  currentTab === 'noivos-painel' ? 'text-terracotta font-semibold' : 'text-olive hover:text-terracotta'
                }`}
              >
                Painel Noivos 👑
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 border border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-all text-xs tracking-wider uppercase font-semibold py-2 px-4 rounded-sm label-text"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1 bg-terracotta hover:bg-terracotta-hover text-white transition-all text-xs tracking-wider uppercase font-semibold py-2 px-4 rounded-sm label-text"
              >
                <Lock size={14} />
                <span>Entrar</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => handleNav('noivos-painel')}
                className="p-2 text-olive font-medium text-xs bg-olive-light/30 rounded-sm"
              >
                Painel
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal hover:text-terracotta p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-olive/10 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left label-text py-2 px-3 text-xs tracking-widest ${
                currentTab === item.id ? 'text-terracotta font-bold bg-ivory-dark/40' : 'text-charcoal/70'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleNav('noivos-painel')}
              className={`block w-full text-left label-text py-2 px-3 text-xs tracking-widest font-bold ${
                currentTab === 'noivos-painel' ? 'text-terracotta' : 'text-olive'
              }`}
            >
              👑 Painel Noivos
            </button>
          )}
          <div className="pt-4 border-t border-olive/10">
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full border border-terracotta text-terracotta py-2 px-4 rounded-sm font-semibold text-xs tracking-wider uppercase label-text"
              >
                <LogOut size={14} />
                <span>Sair da Área dos Noivos</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenLogin();
                }}
                className="flex items-center justify-center space-x-2 w-full bg-terracotta text-white py-2 px-4 rounded-sm font-semibold text-xs tracking-wider uppercase label-text"
              >
                <Lock size={14} />
                <span>Acesso dos Noivos</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
