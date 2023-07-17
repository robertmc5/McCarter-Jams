import PlaylistPanel from "../../components/playlistPanel/PlaylistPanel";
import TrackList from "../../components/trackList/TrackList";
import '../newPlaylist/playlist.css';

const ExistingPlaylist = (props) => {
  function handleNameChange(e) {
    props.onNameChange(e.target.value);
  }

  function rescindEditsWarning() {
    return (props.editingExisting && props.existingPlaylistId !== props.selectPlaylist) ? true: false;
  }

  function noSelection() {
    return (!props.selectPlaylist && !props.editingExisting) ? true: false;
  }

  const isLoading = !props.editingExisting && props.selectPlaylist && (props.existingPlaylistTracks.length === 0 || props.existingPlaylistId !== props.selectPlaylist) ? true: false;

  return (
    <div className='playlist'>
      <PlaylistPanel  
        onSwitch={props.onSwitch}
        title={props.editingExisting ? "Edit Playlist" : "Edit/View Playlist"} />

      {!rescindEditsWarning() && noSelection() &&
        <p className="no-selection">No playlist has been selected</p>
      }

      {!rescindEditsWarning() && !noSelection() &&
        (isLoading ? 
        <span className='highlight line-height'>Loading...</span>
        : <input value={props.existingPlaylistName} onChange={handleNameChange} />)
      }

      <div className="playlist-tracks">
        {!rescindEditsWarning() && !noSelection() && 
          (isLoading ? 
            <></>
            : <TrackList 
                tracks={props.existingPlaylistTracks} 
                onRemove={props.onRemove}
                isRemoval={true} />)
        }

        {rescindEditsWarning() && 
          <div className="edits-warning">
            <p>Existing playlist was unselected with unsaved changes made.</p>
            <p>Do you want to save your changes to</p>
            <p><span id="edits-warning_playlist">{props.existingPlaylistName}</span> ?</p>
            <div className="edits-warning_buttons">
              <button type='button' onClick={props.onSave}>Yes, SAVE changes</button>
              <button type='button' onClick={props.onRescind}>No, DISCARD changes</button>
            </div>
          </div>
        }
      </div>

      <button className="playlist-save" 
        onClick={props.onSave} 
        disabled={!props.editingExisting} >
          {(!isLoading && props.existingPlaylistTracks.length === 0) ? 'DELETE SPOTIFY PLAYLIST': 'SAVE SPOTIFY UPDATE'}
      </button>
    </div>
  )
}

export default ExistingPlaylist;
