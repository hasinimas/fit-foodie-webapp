import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => navigate(path)}
      className={`nav-button ${isActive ? 'active' : ''}`}
    >
      <div className="flex items-center">
        <span className="icon">{icon}</span>
        <span className="label">{label}</span>
      </div>
    </button>
  );
};

export default NavButton;
