import './playlistPanel.css';

const PlaylistPanel = ({ onSwitch, title }) => {

  const handleSwitch = (e) => {
    onSwitch(e.target.value);
  }
  return (
    <div className="PlaylistPanel">
      <div className='PlaylistPanel-btns'>
        <button type='button' value='New' onClick={handleSwitch}>Create New<br />Playlist</button>
        <button type='button' value='All' onClick={handleSwitch}>Display All<br />Playlists</button>
        <button type='button' value='Edit' onClick={handleSwitch}>Edit/View<br />Playlist</button>
      </div>
      <div className='PlaylistPanel-title'>
        {title}
      </div>
    </div>
  );
}

export default PlaylistPanel;
