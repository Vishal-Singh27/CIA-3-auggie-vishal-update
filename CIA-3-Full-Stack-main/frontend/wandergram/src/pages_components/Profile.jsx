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

  useEffect(() => {
    async function load_data() {
      let response = await axios.get(`http://localhost:5002/posts/${username}`);
      let data = response.data;
      if (data.message){
        setEmpty(true);
      }
      else {
        setEmpty(false);
        setPosts(data);
      }
      setLoaded(true);
    }
    load_data();
  }, [username])
  
    if (loaded){
      if (empty)
        return (
          <div className='h-screen text-center'>{user == username ? (<div>You havent posted anything yet! <Link to="/add_post"><u>Add Post</u></Link> </div>) : (<div> {username} hasnt posted anything yet!</div>)} </div>
        )
      else 
        return (
          <div className=' flex-wrap'>
            {posts.map(post => (
              <Post data={post} className="" />
            ))}
          </div>
        )
    }
    else {
      return (
        <div className='h-screen text-center'>Feed is loading....</div>
      );
    } 
}
