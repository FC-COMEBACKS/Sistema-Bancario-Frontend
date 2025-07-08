import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminOverview from '../../components/dashboard/AdminOverview';
import ClienteHome from '../../components/dashboard/ClienteHome';
import WelcomeGuest from '../../components/dashboard/WelcomeGuest';
import './dashboardPage.css';

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userString = localStorage.getItem('user');
            
            if (!userString) {
                console.log('No user data found, redirecting to login');
                navigate('/auth');
                return;
            }
            
            const userData = JSON.parse(userString);
            
            const role = (userData.rol || userData.role || '').toLowerCase();
            
            const path = location.pathname;
            console.log('Current path:', path, 'User role:', role);
            
            if (path === '/dashboard/admin' && !role.includes('admin')) {
                console.log('Non-admin trying to access admin page, redirecting to client dashboard');
                navigate('/dashboard/cliente');
            } else if (path === '/dashboard/cliente' && role.includes('admin')) {
                console.log('Admin trying to access client page, redirecting to admin dashboard');
                navigate('/dashboard/admin');
            } else if (path === '/') {
                console.log('Root path, redirecting based on role');
                role.includes('admin') ? navigate('/dashboard/admin') : navigate('/dashboard/cliente');
            }
        } catch (error) {
            console.error('Error in dashboard redirection:', error);
            navigate('/auth');
        }
    }, [location.pathname, navigate]);

    const renderDashboardByRole = () => {
        if (location.pathname.includes('/admin')) {
            return <AdminOverview />;
        } else if (location.pathname.includes('/cliente')) {
            return <ClienteHome />;
        } else {
            return <WelcomeGuest />;
        }
    };
    
    return (
        <div className="dashboard-page">
            {renderDashboardByRole()}
        </div>
    );
};

export default DashboardPage;