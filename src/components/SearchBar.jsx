import React from 'react';

function SearchBar() {
  return (
    <div>
      <section className="searchInput">
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search"
        />
      </section>

      <section className="searchBy">
        <input
          type="radio"
          data-testid="ingredient-search-radio"
          value="ingredient"
          id="ingredient"
        />
        <label htmlFor="ingredient">Ingredient</label>
        <input
          type="radio"
          data-testid="name-search-radio"
          value="name"
          id="name"
        />
        <label htmlFor="name">Name</label>
        <input
          type="radio"
          data-testid="first-letter-search-radio"
          value="firstLetter"
          id="firstLetter"
        />
        <label htmlFor="firstLetter">First Letter</label>
      </section>

      <section className="searchBtn">
        <button
          type="button"
          data-testid="exec-search-btn"
        >
          Search
        </button>
      </section>
    </div>
  );
}

export default SearchBar;
