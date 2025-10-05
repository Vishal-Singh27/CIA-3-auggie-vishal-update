import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './Context';
import { Post } from "./Post";
import axios from 'axios';
import { Link, useParams } from 'react-router';


export const Liked_posts = (props) => {
  // User that is logged in currently
  const { user, isLoggedIn } = useContext(AuthContext);

  const [posts, setPosts] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    async function load_data() {
      let response = await axios.get(`http://localhost:5002/posts/liked/${user}`);
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
  }, [user])
  
    if (loaded){
      if (empty)
        return (
          <div className='h-screen text-center'><div>You havent liked anything yet! </div> </div>
        )
      else 
        return (
          <div>
            <div className='h-screen flex-wrap'>
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
