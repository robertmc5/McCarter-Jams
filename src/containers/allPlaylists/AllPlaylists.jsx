import PlaylistPanel from '../../components/playlistPanel/PlaylistPanel';
import TitlePlaylist from '../../components/titlePlaylist/TitlePlaylist';
import '../newPlaylist/playlist.css';

const AllPlaylists = (props) => {

  const isLoading = props.allPlaylists.length === 0 ? true: false;

  return (
    <div className="playlist">
      <PlaylistPanel  
        onSwitch={props.onSwitch}
        title="Display All Playlists" />
      
      {isLoading ? 
        <span className='highlight line-height'>Loading...</span>
        : <div className='user-name-and-total'>
            <h3>{props.userNameAndTotal[0]}</h3>
            <p>{props.userNameAndTotal[1]} playlists</p>
          </div>
      }

      <div className="list-of-playlists">
        {props.allPlaylists.map(item => 
          <TitlePlaylist 
            item={item} 
            key={item.id}
            selectPlaylist={props.selectPlaylist}
            onSelect={props.onSelect} />
        )}
      </div>

      <div className='how-to-select'>
        <p>To Edit/View A Playlist</p>
        <p>Select Playlist</p>
        <p>then Edit/View Button</p>
      </div>
    </div>
  );
}

export default AllPlaylists;
