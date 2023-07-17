import './titlePlaylist.css';

const TitlePlaylist = ({item, selectPlaylist, onSelect}) => {

  const handleClick = () => {
    if (selectPlaylist !== item.id) {
      onSelect(item.id)
    }
    else if (selectPlaylist === item.id) {
      onSelect('')
    }
  }

  return (
    <div className={selectPlaylist === item.id ? "TitlePlaylist activeSelect" : "TitlePlaylist"}
      onClick={ handleClick }>
      <img src={item.image} alt="User Playlist" />
      <div>
        <h3>{item.name}</h3>
        <p>{item.totalTracks} tracks</p>
      </div>
    </div>
  );
}

export default TitlePlaylist;
