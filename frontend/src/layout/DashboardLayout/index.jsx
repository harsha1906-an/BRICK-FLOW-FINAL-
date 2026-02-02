import React from 'react';
import useMobile from '@/hooks/useMobile';

export default function DashboardLayout({ children }) {
  const isMobile = useMobile();

  return (
    <div className="dashboard-content">
      {children}
    </div>
  );
}
