import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './Context';
import { Post } from "./Post";
import axios from 'axios';
import { Link, useParams } from 'react-router';


export const Profile = (props) => {
  // User who's profile we viewing
  let { username } = useParams();
  
  // User that is logged in currently
  const { user, isLoggedIn } = useContext(AuthContext);

  const [posts, setPosts] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [following, isFollowing] = useState(false);

  useEffect(() => {
    async function load_data() {
      let response = await axios.get(`http://localhost:5002/posts/${username}`);
      let data = response.data;
      if (data.message){
        setEmpty(true);
      }
      else {
        let follower_res = await axios.get(`http://localhost:5002/user/followers/${username}`)
        let followers = follower_res.data.Followers;
        (followers.includes(user)) ? isFollowing(true) : isFollowing(false);
        setEmpty(false);
        setPosts(data);
      }
      setLoaded(true);
    }
    load_data();
  }, [username, user])
  
    if (loaded){
      if (empty)
        return (
          <div className='h-screen text-center'>{user == username ? (<div>You havent posted anything yet! <Link to="/add_post"><u>Add Post</u></Link> </div>) : (<div> {username} hasnt posted anything yet!</div>)} </div>
        )
      else 
        return (
          <div>
            {user == username ? null : (<div>{following ? (<button onClick={async () => {
              await axios.post(`http://localhost:5002/user/${username}/unfollow`, {"username" : user});
              isFollowing(false);
            }}>Unfollow</button>) : (<button onClick={async () => {
              await axios.post(`http://localhost:5002/user/${username}/follow`, {"username" : user});
              isFollowing(true);
            }}>Follow {following}</button>)}</div>)}
            <div className=' flex-wrap'>
              {posts.map(post => (
                <Post data={post} className="" />
              ))}
            </div>
          </div>
        )
    }
    else {
      return (
        <div className='h-screen text-center'>Feed is loading....</div>
      );
    } 
}
