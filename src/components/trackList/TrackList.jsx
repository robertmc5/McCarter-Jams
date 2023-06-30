import Track from '../track/Track';
import './trackList.css';

const TrackList = (props) => {
  return (
    <div className="TrackList">
      {props.tracks.map(
        track => <Track 
          track={track} 
          key={track.id} 
          onAdd={props.onAdd} 
          onRemove={props.onRemove}
          isRemoval={props.isRemoval} />
      )}
    </div>
  );
}

export default TrackList;
