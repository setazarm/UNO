import axios from 'axios';
import { useEffect, useState } from 'react';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');


  useEffect(() => {
    axios
      .get('http://localhost:8000/users')
      .then(res => {
        setPlayers(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );
  const likeHandler=(id)=>{
    
    console.log(id)

  axios.patch(`http://localhost:8000/users/like/${id}`,null,{headers:{token:localStorage.getItem('token')}})
  .then(res=>{
    if(res.data.success){
      setPlayers(res.data.data)
    }

  })

  }


  return (
    <div className="bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-700 min-h-screen text-white py-10 px-4 md:px-10">
    <h1 className="text-4xl text-center mb-8">Players</h1>
    <div className="max-w-md mx-auto mb-8">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-md bg-cyan-900 text-white focus:outline-none"
      />
    </div>

    {loading ? (
      <p className="text-center">Loading...</p>
    ) : error ? (
      <p className="text-center">Error</p>
    ) : filteredPlayers.length === 0 ? (
      <p className="text-center">No results found</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlayers.map(player => (
          <div
            key={player._id}
            className=" bg-cyan-900 p-4 rounded-lg shadow-md"
          >
            <img
              src={player.Avatar}
              alt="player"
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{player.name}</h3>
            <p className="mb-2">Status: {player.status}</p>
            <p className="mb-2">Points: {player.points}</p>
            <button
              onClick={()=>likeHandler(player._id)}
            >Like {" "}
          
              {player?.likes?.length}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default Players;