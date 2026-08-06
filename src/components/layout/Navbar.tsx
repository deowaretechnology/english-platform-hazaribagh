import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, Phone, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/classes', label: 'Classes & Notes' },
    { path: '/tests', label: 'Test Series' },
    { path: '/admission', label: 'Admission' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src={logo}
                alt="English Platform Hazaribagh Logo"
                className="w-full h-full object-contain rounded-[10px]"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
                ENGLISH PLATFORM
              </div>
              <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
                HAZARIBAGH • COACHING INSTITUTE
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth / Call Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold">+91 98765 43210</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-800 px-3.5 py-2 rounded-xl text-sm font-semibold border border-blue-200 transition-all"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="max-w-[100px] truncate">{user?.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/admission"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-all hover:shadow-md flex items-center gap-1"
                >
                  <span>Apply Online</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/profile"
                className="p-2 text-blue-600 bg-blue-50 rounded-lg border border-blue-200"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-blue-50 text-blue-800 font-semibold px-4 py-3 rounded-xl flex items-center justify-between border border-blue-200"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    <span>My Profile ({user?.name})</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-red-600 hover:bg-slate-100 font-medium px-4 py-2.5 rounded-xl text-left text-sm"
                >
                  Logout Session
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-slate-100 text-slate-800 font-bold py-3 rounded-xl border border-slate-200 text-sm"
                >
                  Student Login
                </Link>
                <Link
                  to="/admission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-sm"
                >
                  Apply Online
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};