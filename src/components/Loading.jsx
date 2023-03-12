import React from 'react';
import rotatingLogo from '../images/isLoading.svg';
import '../css/Loading.css';

export default function Loading() {
  return (
    <div className="loading">
      <img
        src={ rotatingLogo }
        alt="Rotating Logo"
      />
    </div>
  );
}
