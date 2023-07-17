import TrackList from '../../components/trackList/TrackList';
import './searchResults.css';

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <div className='SearchResults-tracks'>
        <TrackList tracks={props.searchResults} onAdd={props.onAdd} isRemoval={false} />
      </div>
    </div>
  );
}

export default SearchResults;
