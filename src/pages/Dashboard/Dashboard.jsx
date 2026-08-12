import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Button from '../../components/Button/Button';
import DashboardFeedback from '../../components/DashboardFeedback/DashboardFeedback';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const ADMIN_EMAILS = [
  'hunain.jd@gmail.com',
  'jenngbari@gmail.com',
  'angeleenmatti@gmail.com',
  'lhok.business@gmail.com',
];

  // Redirect to login if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>Welcome back!</h1>

        {user && (
          <p className={styles.subtitle}>
            Logged in as <strong>{user.displayName || user.email}</strong>
          </p>
        )}

        <div className={styles.actions}>
          <Button
            label="Update My Profile"
            onClick={() => navigate('/profile')}
          />
          <Button
            label="Log Out"
            onClick={handleLogout}
          />
         
         
          {user && ADMIN_EMAILS.includes(user.email?.toLowerCase()) && (
          <Button
            label="Admin Panel"
            onClick={() => navigate('/admin')}
          />
)}

        </div>

        {user && <DashboardFeedback />}

      </div>
    </div>
  );
}

export default Dashboard;