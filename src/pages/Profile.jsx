import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Profile() {
  return (
    <div>
      <Header />
      <h1 data-testid="page-title">Profile</h1>
      <Footer />
    </div>
  );
}
