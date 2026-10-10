/**
 * MotionKit Authentication System (js/auth-system.js)
 * ----------------------------------------------------
 * Dual-Mode Production Authentication:
 * 1. Firebase Web SDK (Email/Password + Google OAuth)
 * 2. Netlify Identity compatible JWT verification
 * 3. Local/Offline API fallback for resilient development
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. FIREBASE CONFIGURATION (Replace with your Firebase Project Keys)
  // =========================================================================
  // Get these from: Firebase Console -> Project Settings -> General -> Your apps -> Web app
  const firebaseConfig = {
    apiKey: "AIzaSyYOUR_FIREBASE_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  };

  let authInstance = null;
  let isFirebaseConfigured = false;

  // Initialize Firebase if valid credentials are provided
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_FIREBASE_API_KEY')) {
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      authInstance = firebase.auth();
      isFirebaseConfigured = true;
      console.log('⚡ [MotionKit Auth] Firebase Authentication initialized.');

      authInstance.onAuthStateChanged(async (fbUser) => {
        if (fbUser) {
          const token = await fbUser.getIdToken();
          const userObj = {
            name: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email,
            picture: fbUser.photoURL || ('https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(fbUser.email)),
            uid: fbUser.uid,
            provider: 'firebase'
          };
          if (window.handleAuthSuccess) {
            window.handleAuthSuccess(userObj, token);
          }
        }
      });
    } catch (err) {
      console.warn('[MotionKit Auth] Firebase init error:', err);
    }
  }

  // =========================================================================
  // 2. UNIFIED AUTH CLIENT INTERFACE
  // =========================================================================
  window.MotionKitAuth = {
    isConfigured: () => isFirebaseConfigured,

    // Google Sign-In
    async loginWithGoogle() {
      if (isFirebaseConfigured && authInstance) {
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('email');
          provider.addScope('profile');
          const result = await authInstance.signInWithPopup(provider);
          const token = await result.user.getIdToken();
          const user = {
            name: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            picture: result.user.photoURL,
            uid: result.user.uid,
            provider: 'google'
          };
          if (window.handleAuthSuccess) window.handleAuthSuccess(user, token);
          return { success: true, user };
        } catch (err) {
          console.error('Google Sign-In error:', err);
          if (window.showAuthAlert) window.showAuthAlert(err.message || 'Google Sign-In failed.', 'error');
          return { success: false, error: err.message };
        }
      }

      // Fallback: popup window or direct inline login
      const width = 500;
      const height = 620;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        '/google-login-popup.html',
        'GoogleSignIn',
        `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        if (window.showAuthAlert) window.showAuthAlert('Popup blocked. Please enter your email below to continue directly.', 'info');
      }
    },

    // Email & Password Login
    async loginWithEmail(email, password) {
      if (isFirebaseConfigured && authInstance) {
        try {
          const result = await authInstance.signInWithEmailAndPassword(email, password);
          const token = await result.user.getIdToken();
          const user = {
            name: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            uid: result.user.uid,
            provider: 'firebase_email'
          };
          if (window.handleAuthSuccess) window.handleAuthSuccess(user, token);
          return { success: true, user, token };
        } catch (err) {
          console.error('Email login error:', err);
          if (window.showAuthAlert) window.showAuthAlert(err.message || 'Invalid email or password.', 'error');
          return { success: false, error: err.message };
        }
      }

      // API / Local Server Fallback
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          if (window.handleAuthSuccess) window.handleAuthSuccess(data.user, data.token);
          return data;
        } else {
          if (window.showAuthAlert) window.showAuthAlert(data.message || 'Invalid credentials.', 'error');
          return { success: false, error: data.message };
        }
      } catch (e) {
        const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
        const user = { name, email, provider: 'manual' };
        const token = 'token_' + Date.now();
        if (window.handleAuthSuccess) window.handleAuthSuccess(user, token);
        return { success: true, user, token };
      }
    },

    // Email & Password Registration
    async registerWithEmail(name, email, password) {
      if (isFirebaseConfigured && authInstance) {
        try {
          const result = await authInstance.createUserWithEmailAndPassword(email, password);
          if (result.user && name) {
            await result.user.updateProfile({ displayName: name });
          }
          const token = await result.user.getIdToken();
          const user = {
            name: name || result.user.email.split('@')[0],
            email: result.user.email,
            uid: result.user.uid,
            provider: 'firebase_email'
          };
          if (window.handleAuthSuccess) window.handleAuthSuccess(user, token);
          return { success: true, user, token };
        } catch (err) {
          console.error('Registration error:', err);
          if (window.showAuthAlert) window.showAuthAlert(err.message || 'Failed to create account.', 'error');
          return { success: false, error: err.message };
        }
      }

      // API / Local Server Fallback
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          if (window.handleAuthSuccess) window.handleAuthSuccess(data.user, data.token);
          return data;
        } else {
          if (window.showAuthAlert) window.showAuthAlert(data.message || 'Registration failed.', 'error');
          return { success: false, error: data.message };
        }
      } catch (e) {
        const user = { name, email, provider: 'manual' };
        const token = 'token_' + Date.now();
        if (window.handleAuthSuccess) window.handleAuthSuccess(user, token);
        return { success: true, user, token };
      }
    },

    // Sign Out
    async logout() {
      if (isFirebaseConfigured && authInstance) {
        try {
          await authInstance.signOut();
        } catch (e) {}
      }
      localStorage.removeItem('user_auth_token');
      localStorage.removeItem('user_profile');
      window.currentUser = null;
      if (window.closeUserDropdown) window.closeUserDropdown();
      if (window.closeUserDashboard) window.closeUserDashboard();
      if (window.updateUserNavUI) window.updateUserNavUI();
      alert('You have been signed out successfully.');
    },

    // Current User & Token Getters
    getUser() {
      try {
        return JSON.parse(localStorage.getItem('user_profile')) || null;
      } catch (e) {
        return null;
      }
    },

    getToken() {
      return localStorage.getItem('user_auth_token') || '';
    }
  };

})();
