import React from 'react';
import './searchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    };

    this.search = this.search.bind(this);
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
  }

  search() {
    this.props.onSearch(this.state.searchTerm)
  }

  handleSearchTermChange(e) {
    this.setState( {searchTerm: e.target.value} );
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleSearchTermChange}/>
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;
