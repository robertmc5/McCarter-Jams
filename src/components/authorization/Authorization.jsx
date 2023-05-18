import './authorization.css';

const Authorization = (props) => {
  return (
    <div className="Authorization">
      <h4>Click to authorize<br />Spotify access</h4>
      <button onClick={() => props.onAuthorize()} type="button">BEGIN</button>
    </div>
  )
}

export default Authorization;
