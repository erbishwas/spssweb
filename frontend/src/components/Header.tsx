import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Contact from '../pages/Contact';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpenDesktop, setIsDropdownOpenDesktop] = useState(false);
  const [isExtrasDropdownOpenDesktop, setIsExtrasDropdownOpenDesktop] = useState(false);
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);
  const [isExtrasDropdownOpenMobile, setIsExtrasDropdownOpenMobile] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const extrasDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { to: '/engineering', label: 'Engineering' },
    { to: '/notices', label: 'Notice' },
  ];

  const dropdownItems = [
    { to: '/aboutus', label: 'Introduction' },
    { to: '/staffs', label: 'Our Team' },
    { to: '/committee', label: 'Management Committee' },
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Photo Gallery' },
  ];

  const extrasDropdownItems = [
    { to: '/routines', label: 'Routines' },
  ];

  const isDropdownRouteActive = dropdownItems.some(item =>
    location.pathname.startsWith(item.to)
  );

  const isExtrasDropdownRouteActive = extrasDropdownItems.some(item =>
    location.pathname.startsWith(item.to)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        extrasDropdownRef.current &&
        !extrasDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpenDesktop(false);
        setIsExtrasDropdownOpenDesktop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>
        {`
          @layer utilities {
            @keyframes blink {
              0%, 100% { background: linear-gradient(to right, #3b82f6, #1d4ed8); }
              33% { background: linear-gradient(to right, #10b981, #065f46); }
              66% { background: linear-gradient(to right, #8b5cf6, #6d28d9); }
            }
            .animate-blink {
              animation: blink 3s infinite;
            }
          }
        `}
      </style>
      <header className="sticky top-0 bg-gray-200 dark:bg-gray-900 dark:border-gray-300 dark:border-b-2 shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/defaults/logo.png`}
                  alt="School Logo"
                  className="h-12 w-12 rounded-full bg-green-50"
                />
                <span className="ml-2 md:ml-3 text-xl md:text-2xl font-semibold text-blue-500 dark:text-white">
                  SPSS
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-2 md:space-x-3 lg:space-x-4 items-center">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-blink"
                >
                  Dashboard
                </Link>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                    }`
                  }
                >
                  Home
                </NavLink>

                {/* About Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsDropdownOpenDesktop(prev => !prev)
                    }
                    className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                      isDropdownRouteActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                    }`}
                  >
                    About
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpenDesktop && (
                    <div className="absolute top-full left-0 mt-1 md:mt-2 w-40 md:w-44 bg-lime-200 dark:bg-gray-700 rounded-lg shadow-lg z-50">
                      {dropdownItems.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`block px-4 py-2 ${
                            location.pathname === item.to
                              ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-50 hover:bg-teal-300 dark:hover:bg-gray-600 hover:text-white'
                          }`}
                          onClick={() => setIsDropdownOpenDesktop(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                {/* Extras Dropdown */}
                <div className="relative" ref={extrasDropdownRef}>
                  <button
                    onClick={() =>
                      setIsExtrasDropdownOpenDesktop(prev => !prev)
                    }
                    className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                      isExtrasDropdownRouteActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                    }`}
                  >
                    Extras
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isExtrasDropdownOpenDesktop && (
                    <div className="absolute top-full left-0 mt-1 md:mt-2 w-40 md:w-44 bg-lime-200 dark:bg-gray-700 rounded-lg shadow-lg z-50">
                      {extrasDropdownItems.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`block px-4 py-2 ${
                            location.pathname === item.to
                              ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-50 hover:bg-teal-300 dark:hover:bg-gray-600 hover:text-white'
                          }`}
                          onClick={() => setIsExtrasDropdownOpenDesktop(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink
                  key="/contact"
                  to="/contact"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                    }`
                  }
                >
                  Contact Us
                </NavLink>
                <Link
                  to="/joinus"
                  className="inline-flex items-center px-3 md:px-4 py-1 md:py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-sm md:text-base"
                >
                  <span>Join</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 space-y-2">
              <Link
                to="/dashboard"
                className="block px-4 py-2 rounded-full font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-blink"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                Home
              </NavLink>

              {/* Mobile About Dropdown */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setIsDropdownOpenMobile(prev => !prev)}
                  className={`flex items-center w-full ${
                    isDropdownRouteActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                  }`}
                >
                  About
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpenMobile && (
                  <div className="mt-2">
                    {dropdownItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`block px-4 py-2 ${
                          location.pathname === item.to
                            ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-50 hover:bg-teal-300 dark:hover:bg-gray-600 hover:text-white'
                        }`}
                        onClick={() => {
                          setIsDropdownOpenMobile(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile Extras Dropdown */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setIsExtrasDropdownOpenMobile(prev => !prev)}
                  className={`flex items-center w-full ${
                    isExtrasDropdownRouteActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'
                  }`}
                >
                  Extras
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isExtrasDropdownOpenMobile && (
                  <div className="mt-2">
                    {extrasDropdownItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`block px-4 py-2 ${
                          location.pathname === item.to
                            ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-50 hover:bg-teal-300 dark:hover:bg-gray-600 hover:text-white'
                        }`}
                        onClick={() => {
                          setIsExtrasDropdownOpenMobile(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                key="/contact"
                to="/contact"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </NavLink>

              <div className="px-4 py-2">
                <Link
                  to="/joinus"
                  className="block w-full text-left px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Us
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;