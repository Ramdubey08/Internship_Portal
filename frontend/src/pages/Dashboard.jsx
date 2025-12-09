import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="container mt-2">
      <h1>Dashboard</h1>
      <div className="card mt-2">
        <h2>Welcome, {profile?.user?.username}!</h2>
        <p>Role: {profile?.role}</p>
        <p>This is your dashboard. More features coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;
