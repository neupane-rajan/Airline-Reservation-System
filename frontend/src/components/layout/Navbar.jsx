import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  TicketIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: HomeIcon 
    },
    { 
      name: 'Search Flights', 
      path: '/search', 
      icon: MagnifyingGlassIcon 
    },
    { 
      name: 'My Bookings', 
      path: '/bookings', 
      icon: TicketIcon 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: UserIcon 
    }
  ];

  return (
    <nav className="bg-brand-blue text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div 
          className="text-2xl font-bold cursor-pointer flex items-center"
          onClick={() => navigate('/dashboard')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          Skyline
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-2 
                  ${location.pathname === item.path 
                    ? 'text-white font-bold' 
                    : 'text-gray-200 hover:text-white'}
                  transition-colors duration-300
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {/* User Info and Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span className="text-sm">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="
                  flex items-center space-x-2
                  bg-red-500 
                  text-white 
                  px-3 
                  py-1 
                  rounded-md 
                  hover:bg-red-600 
                  transition-colors
                "
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;