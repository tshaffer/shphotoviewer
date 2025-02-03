import React, { useEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import { loadMediaItems, loadKeywordData, loadTakeouts, importFromTakeout, loadDeletedMediaItems } from '../controllers';
import { TedTaggerDispatch, setAppInitialized, setGoogleUserProfile } from '../models';
import { getKeywordRootNodeId, getPhotoLayout, getSelectedMediaItems } from '../selectors';

import LoupeViewController from './LoupeViewController';
import { MediaItem, PhotoLayout } from '../types';
import SurveyView from './SurveyView';
import TopToolbar from './TopToolbar';
import GridView from './GridView';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

export interface AppProps {
  photoLayout: PhotoLayout;
  selectedMediaItems: MediaItem[],
  onLoadKeywordData: () => any;
  onLoadMediaItems: () => any;
  onLoadDeletedMediaItems: () => any;
  onLoadTakeouts: () => any;
  onSetAppInitialized: () => any;
  keywordRootNodeId: string;
  onImportFromTakeout: (id: string) => void;
  onSetGoogleUserProfile: (googleUserProfile: any) => void;
}

const App = (props: AppProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [uploadingToGoogle, setUploadingToGoogle] = useState(false);
  const [mergingPeople, setMergingPeople] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Save the access token, expiration, and Google ID in localStorage
  const saveTokens = (token: string, expiresIn: number, googleId: string) => {
    const expirationTime = Date.now() + expiresIn * 1000; // Convert to milliseconds
    localStorage.setItem('googleAccessToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('googleId', googleId);
    console.log('Tokens saved successfully.');
  };

  // Check if the access token is expired
  const isTokenExpired = (): boolean => {
    const accessToken = localStorage.getItem('googleAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');

    // Return true if the access token or expiration is missing, or if the token has expired
    return !accessToken || !expiration || Date.now() > parseInt(expiration);
  };

  // Fetch the access token from the cookie
  const fetchAccessToken = async () => {
    // debugger;
    console.log('Fetching access token from /auth/token...');
    try {
      console.log('invoke fetch on auth/token');
      const response = await fetch('http://localhost:8080/auth/token', {  // successfully invokes server function
        // const response = await fetch('http://localhost:5173/auth/token', {  // fails to invoke server function
        // const response = await fetch('/auth/token', { // fails to invoke server function
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
      });
      console.log('response from fetch on auth/token', response);
      // debugger;

      if (response.ok) {
        const data = await response.json();
        const { accessToken, googleId } = data;

        console.log('Access token fetched:', accessToken);
        console.log('Google ID fetched:', googleId);

        const expiresIn = 3600; // 1 hour validity

        // Save the token and Google ID to localStorage
        saveTokens(accessToken, expiresIn, googleId);

        setAccessToken(accessToken);
        setIsLoggedIn(true);
      } else {
        console.warn('No valid access token found. Attempting to refresh...');
        refreshAccessToken(); // Try refreshing if fetching fails
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
      // debugger;
      // logout(); // Logout if fetching fails
    }
  };

  // Refresh the access token using the refresh token endpoint
  const refreshAccessToken = async () => {
    const googleId = localStorage.getItem('googleId');

    if (!googleId) {
      console.error('No Google ID found. Unable to refresh token.');
      setIsLoggedIn(false); // Set user as logged out without triggering a redirect loop
      return; // Prevent further execution
    }

    try {
      const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleId }),
      });

      if (response.ok) {
        const { accessToken, expiresIn } = await response.json();
        console.log('Token refreshed successfully:', accessToken);
        saveTokens(accessToken, expiresIn, googleId);
        setAccessToken(accessToken);
        setIsLoggedIn(true);
        fetchUserProfile();
      } else {
        console.warn('Failed to refresh access token. Logging out...');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  // Logout function to clear localStorage and reload the app
  const logout = () => {
    console.log('Logging out...');
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false); // Set state to logged out
    window.location.href = '/'; // Redirect to the home or login page
  };

  // Set the `webkitdirectory` attribute using ref after the component is mounted
  React.useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute('webkitdirectory', '');
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const expiresIn = params.get('expiresIn');
    const googleId = params.get('googleId');
    const lastGoogleId = localStorage.getItem('googleId');
    const loggedOut = localStorage.getItem('loggedOut');

    console.log('useEffect triggered.');
    console.log('accessToken:', accessToken);
    console.log('expiresIn:', expiresIn);
    console.log('googleId:', googleId);
    console.log('lastGoogleId:', lastGoogleId);
    console.log('loggedOut:', loggedOut);

    // Handle the loggedOut flag and exit if needed
    if (loggedOut === 'true') {
      console.log('User already logged out.');
      localStorage.removeItem('loggedOut');
      setIsLoggedIn(false);
      return; // Prevent further execution
    }

    // Detect user switch and clear localStorage if needed
    if (googleId && googleId !== lastGoogleId) {
      console.log('Detected user switch. Clearing localStorage.');
      localStorage.clear();
    }

    // If query parameters are present, save tokens and clear the URL
    if (accessToken && expiresIn && googleId) {
      console.log('Saving tokens from query params...');
      saveTokens(accessToken, parseInt(expiresIn), googleId);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, '/'); // Clear query params from URL
    }
    // If tokens are not in the query params, attempt to fetch them from cookies
    else if (isTokenExpired()) {
      console.warn('Token expired or missing. Attempting to fetch from server...');
      fetchAccessToken(); // Invoke fetchAccessToken here
    } else {
      console.log('Tokens are valid. User is logged in.');
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/user-profile', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const data = await response.json();
      console.log('User Profile:', data);
      props.onSetGoogleUserProfile(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // Main useEffect to handle authentication and token refreshing
  React.useEffect(() => {
    props.onLoadKeywordData()
      .then(function () {
        return props.onLoadTakeouts();
      }).then(function () {
        return props.onLoadMediaItems();
      }).then(function () {
        return props.onLoadDeletedMediaItems();
      }).then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

  if (!isLoggedIn) {
    return (
      // const response = await fetch('http://localhost:8080/auth/token', {
      <a href="http://localhost:8080/auth/google">Login with Google</a>
      // <a href="/auth/google">Login with Google</a>
    );
  }

  const renderLeftPanel = (): JSX.Element => {
    return (
      <div className='leftColumnStyle'>
      </div>
    );
  };

  const renderPhotoDisplay = (): JSX.Element => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      return (
        <React.Fragment>
          <div id='centerColumn' className='centerColumnStyle'>
            <LoupeViewController />
          </div>
        </React.Fragment>
      );
    } else if (props.photoLayout === PhotoLayout.Survey) {
      return (
        <React.Fragment>
          <div id='centerColumn' className='centerColumnStyle'>
            <SurveyView />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {renderLeftPanel()}
          <div id='centerColumn' className='centerColumnStyle'>
            <GridView />
          </div>
          <div className='rightColumnStyle'>Right Panel</div>
        </React.Fragment>
      );
    }
  };

  const photoDisplay: JSX.Element = renderPhotoDisplay();

  return (
    <div>
      <React.Fragment>
        <TopToolbar />
      </React.Fragment>
      <div className='appStyle'>
        {photoDisplay}
      </div>
    </div>

  );
};

function mapStateToProps(state: any) {
  return {
    photoLayout: getPhotoLayout(state),
    keywordRootNodeId: getKeywordRootNodeId(state),
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onLoadKeywordData: loadKeywordData,
    onLoadMediaItems: loadMediaItems,
    onLoadDeletedMediaItems: loadDeletedMediaItems,
    onSetAppInitialized: setAppInitialized,
    onLoadTakeouts: loadTakeouts,
    onImportFromTakeout: importFromTakeout,
    onSetGoogleUserProfile: setGoogleUserProfile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
