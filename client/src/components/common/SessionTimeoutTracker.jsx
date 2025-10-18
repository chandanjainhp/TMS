import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';

/**
 * SessionTimeoutTracker Component
 * 
 * Tracks user activity and resets the session timeout to prevent automatic logout
 * - Regular users: 30 minute timeout
 * - Admin users: 15 minute timeout
 * 
 * Monitored activities:
 * - Mouse movement
 * - Keyboard input
 * - Click events
 * - Touch events (for mobile)
 * - Scroll events
 */
const SessionTimeoutTracker = () => {
  const { isAuthenticated: userIsAuthenticated, resetSessionTimeout: resetUserTimeout } = useAuthStore();
  const { isAuthenticated: adminIsAuthenticated, resetSessionTimeout: resetAdminTimeout } = useAdminAuthStore();

  useEffect(() => {
    // Only track if user or admin is authenticated
    if (!userIsAuthenticated && !adminIsAuthenticated) {
      return;
    }

    // Throttle function to limit how often we reset the timeout
    let lastResetTime = Date.now();
    const THROTTLE_DELAY = 60000; // Reset at most once per minute

    const handleActivity = () => {
      const now = Date.now();
      
      // Only reset if enough time has passed since last reset
      if (now - lastResetTime >= THROTTLE_DELAY) {
        lastResetTime = now;
        
        // Reset the appropriate timeout based on who is authenticated
        if (userIsAuthenticated) {
          resetUserTimeout();
        }
        if (adminIsAuthenticated) {
          resetAdminTimeout();
        }
      }
    };

    // List of events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup function to remove event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [userIsAuthenticated, adminIsAuthenticated, resetUserTimeout, resetAdminTimeout]);

  // This component doesn't render anything
  return null;
};

export default SessionTimeoutTracker;
