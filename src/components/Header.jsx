import React from 'react';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <div>
      <button data-testid="search-top-btn">Teste</button>
      <SearchBar />
    </div>
  );
}
