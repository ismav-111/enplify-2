
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const NavigationHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'enCore', path: '/', label: 'AI Assistant' },
    { name: 'enDocs', path: '/docs', label: 'Document Management' },
    { name: 'enSights', path: '/insights', label: 'Analytics & Insights' },
    { name: 'enVent', path: '/events', label: 'Event Management' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <span className="text-3xl font-bold text-[#4E50A8] font-comfortaa">
            enplify.ai
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-[#4E50A8] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#4E50A8]'
              }`}
              title={item.label}
            >
              {item.name}
            </button>
          ))}
          
          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className={`h-10 w-10 rounded-full hover:bg-gray-100 ${
              location.pathname === '/settings' ? 'bg-[#4E50A8] text-white hover:bg-[#4E50A8]' : ''
            }`}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default NavigationHeader;
