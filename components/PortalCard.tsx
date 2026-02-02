
import React from 'react';

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'circle' | 'plate';
}

const PortalCard: React.FC<PortalCardProps> = ({ title, description, icon, onClick, variant = 'plate' }) => {
  const isCircle = variant === 'circle';

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white border-4 border-gray-100 hover:border-ssp-blue hover:shadow-[0_20px_50px_rgba(0,51,102,0.2)] 
        transition-all duration-500 cursor-pointer flex flex-col items-center text-center space-y-6 group relative overflow-hidden
        ${isCircle ? 'rounded-full aspect-square justify-center p-12' : 'p-12'}
      `}
      style={!isCircle ? {
        clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
      } : {}}
    >
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-ssp-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

      <div className={`
        p-8 rounded-full transition-all duration-500 transform group-hover:scale-110
        ${isCircle ? 'bg-blue-100 text-ssp-blue group-hover:bg-ssp-blue group-hover:text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-ssp-blue group-hover:text-white'}
      `}>
        {React.cloneElement(icon as React.ReactElement<any>, { 
          className: "w-16 h-16 transition-colors duration-300" 
        })}
      </div>

      <div className="space-y-4 max-w-[280px]">
        <h3 className="heading-text text-ssp-blue tracking-widest text-2xl">{title}</h3>
        <p className="normal-text text-gray-500 leading-relaxed font-bold italic">{description}</p>
      </div>

      <div className={`
        mt-6 px-10 py-3 bg-ssp-blue text-white rounded-sm font-black uppercase tracking-[0.2em] text-sm shadow-xl
        transform transition-all duration-300 group-hover:translate-y-[-5px] group-hover:bg-black
      `}>
        Access Portal
      </div>
      
      {/* Decorative Steel Texture lines for plate variant */}
      {!isCircle && (
        <div className="absolute top-4 right-10 w-12 h-1 bg-gray-100 group-hover:bg-ssp-blue transition-colors"></div>
      )}
    </div>
  );
};

export default PortalCard;
