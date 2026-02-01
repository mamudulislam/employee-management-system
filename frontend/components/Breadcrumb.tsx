import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <button
        className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
        onClick={() => window.location.href = '/'}
      >
        <Home size={16} />
        Home
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-slate-400" />
          {item.href || item.onClick ? (
            <a
              href={item.href || '#'}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}

      {currentPage && (
        <>
          <ChevronRight size={16} className="text-slate-400" />
          <span className="text-indigo-600 font-bold">{currentPage}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
