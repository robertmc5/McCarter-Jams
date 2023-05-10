import React, { useState } from 'react';
import './searchBar.css';

const SearchBar = ({onSearch}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const search = (e) => {
    e.preventDefault();
    onSearch(searchTerm)
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <form className="SearchBar" onSubmit={search}>
      <input placeholder="Enter A Song, Album, or Artist" onChange={handleSearchTermChange}/>
      <button className="SearchButton" type="submit">SEARCH</button>
    </form>
  );
}

export default SearchBar;
