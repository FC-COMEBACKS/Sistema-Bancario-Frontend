import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="flex">
        <Sidebar />
        <div className="content-area w-full">
          <Topbar />
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
