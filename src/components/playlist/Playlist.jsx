import TrackList from '../trackList/TrackList';
import './playlist.css';

const Playlist = (props) => {
  function handleNameChange(e) {
    props.onNameChange(e.target.value);
  }

  return (
    <div className="Playlist">
      <input value={props.playlistName} onChange={handleNameChange} />
      <TrackList 
        tracks={props.playlistTracks} 
        onRemove={props.onRemove}
        isRemoval={true} />
      <button className="Playlist-save" onClick={props.onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
