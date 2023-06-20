import TrackList from '../../components/trackList/TrackList';
import './searchResults.css';

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={props.searchResults} onAdd={props.onAdd} isRemoval={false} />
    </div>
  );
}

export default SearchResults;
