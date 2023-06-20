import TrackList from '../../components/trackList/TrackList';
import PlaylistPanel from '../../components/playlistPanel/PlaylistPanel';
import './playlist.css';

const NewPlaylist = (props) => {
  function handleNameChange(e) {
    props.onNameChange(e.target.value);
  }

  return (
    <div className="playlist">
      <PlaylistPanel  
        onSwitch={props.onSwitch}
        title="Create New Playlist" />
      <input value={props.newPlaylistName} onChange={handleNameChange} />
      <TrackList 
        tracks={props.newPlaylistTracks} 
        onRemove={props.onRemove}
        isRemoval={true} />
      <button className="playlist-save" onClick={props.onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default NewPlaylist;
