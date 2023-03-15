import React from 'react';
import Track from '../track/Track';
import './trackList.css';

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map(
          trackObj => <Track track={trackObj} 
            key={trackObj.id} 
            onAdd={this.props.onAdd} 
            onRemove={this.props.onRemove}
            isRemoval={this.props.isRemoval} />
        )}
      </div>
    );
  }
}

export default TrackList;
