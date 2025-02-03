import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('accessToken');

    if (accessToken) {
      localStorage.setItem('googleAccessToken', accessToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Welcome to your Dashboard!</div>;
};

export default Dashboard;
