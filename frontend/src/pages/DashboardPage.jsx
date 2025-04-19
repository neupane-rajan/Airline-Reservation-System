import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '../components/layout/PageTemplate';
import { 
  MagnifyingGlassIcon, 
  TicketIcon, 
  UserIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const DashboardCard = ({ title, description, icon: Icon, onClick, bgColor }) => (
  <div 
    onClick={onClick}
    className={`
      ${bgColor} 
      text-white 
      p-6 
      rounded-xl 
      shadow-md 
      hover:shadow-xl 
      transform 
      hover:-translate-y-2 
      transition-all 
      duration-300 
      cursor-pointer
      flex 
      flex-col 
      justify-between
    `}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <Icon className="h-8 w-8 opacity-75" />
    </div>
    <p className="text-sm">{description}</p>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Search Flights',
      description: 'Find and book your next journey',
      icon: MagnifyingGlassIcon,
      bgColor: 'bg-blue-600',
      onClick: () => navigate('/search')
    },
    {
      title: 'My Bookings',
      description: 'View and manage your flight reservations',
      icon: TicketIcon,
      bgColor: 'bg-green-600',
      onClick: () => navigate('/bookings')
    },
    {
      title: 'Profile',
      description: 'Update your personal information',
      icon: UserIcon,
      bgColor: 'bg-purple-600',
      onClick: () => navigate('/profile')
    },
    {
      title: 'Travel Stats',
      description: 'Explore your travel history',
      icon: ChartBarIcon,
      bgColor: 'bg-orange-600',
      onClick: () => {} // Future implementation
    }
  ];

  return (
    <PageTemplate title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <DashboardCard key={index} {...item} />
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-brand-blue">
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Flights
            </h3>
            <p className="text-3xl font-bold text-brand-blue">
              14
            </p>
          </div>
          <div className="bg-brand-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Upcoming Bookings
            </h3>
            <p className="text-3xl font-bold text-green-600">
              3
            </p>
          </div>
          <div className="bg-brand-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Miles Traveled
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              2,456
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;