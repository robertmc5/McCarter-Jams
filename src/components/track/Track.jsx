import './track.css';

const Track = (props) => {

  // builds a + or - button in the return below, 
  // based on whether Track was called from SearchResults or from Playlist
  function renderAction() {
    return props.isRemoval ? 
      <button className="Track-action" onClick={removeTrack}>-</button>: 
      <button className="Track-action" onClick={addTrack}>+</button>;
  }

  const addTrack = () => {
    props.onAdd(props.track);
  }

  const removeTrack = () => {
    props.onRemove(props.track);
  }

  return (
    <div className="Track">
      <div className="Track-info">
        <h3>{props.track.name}</h3>
        <p>{props.track.artist} | {props.track.album}</p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;
