
import { ResponseMode } from '@/hooks/useChat';

interface LoadingIndicatorProps {
  mode: ResponseMode;
}

const LoadingIndicator = ({ mode }: LoadingIndicatorProps) => {
  const getGradientClasses = () => {
    switch (mode) {
      case 'encore':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500';
      case 'endocs':
        return 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500';
      case 'ensights':
        return 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500';
    }
  };

  return (
    <div className="flex mb-8">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200">
        <span className="text-gray-700 font-bold text-sm font-comfortaa">e</span>
      </div>
      
      <div className="ml-3 max-w-[85%]">
        <div className="text-gray-800 w-full">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full ${getGradientClasses()} animate-pulse`} 
                   style={{ animationDelay: '0ms', animationDuration: '1.5s' }}></div>
              <div className={`w-2 h-2 rounded-full ${getGradientClasses()} animate-pulse`} 
                   style={{ animationDelay: '300ms', animationDuration: '1.5s' }}></div>
              <div className={`w-2 h-2 rounded-full ${getGradientClasses()} animate-pulse`} 
                   style={{ animationDelay: '600ms', animationDuration: '1.5s' }}></div>
            </div>
            <div className="relative">
              <div className={`h-3 w-32 rounded-lg ${getGradientClasses()} opacity-20`}></div>
              <div className={`absolute top-0 left-0 h-3 rounded-lg ${getGradientClasses()} animate-pulse`}
                   style={{ 
                     width: '32%',
                     animation: 'loading-sweep 2s ease-in-out infinite'
                   }}></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {mode === 'encore' && 'Analyzing with Encore intelligence...'}
            {mode === 'endocs' && 'Searching through your documents...'}
            {mode === 'ensights' && 'Generating business insights...'}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-sweep {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
