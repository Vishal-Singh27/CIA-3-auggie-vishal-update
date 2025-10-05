import axios from "axios";
import { Link, useParams } from "react-router";
import { useNavigate } from 'react-router';
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function FullPost() {
  let { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [postAuthor, setAuthor] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [liked, doLike] = useState(false);
  const [comments, add_comment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        let response = await axios.get(`http://localhost:5002/post/${id}`);
        let data = response.data;

        if (data.message === "No post found") {
          setEmpty(true);
        } else {
          let author = (
            await axios.get("http://localhost:5002/user_id/" + data.user)
          ).data.username;
          let likes = await axios.get(`http://localhost:5002/likedBy/${id}`);
          if (likes.data.Users.includes(user)){
            doLike(true);
          }
          else {
            doLike(false);
          }

          // Loading the comments
          let comments = await axios.get(`http://localhost:5002/comments/${id}`);
          add_comment(comments.data);

          setAuthor(author);
          setPost(data);
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
      setLoaded(true);
      
    }
    loadData();
  }, [id, user, isLoggedIn, liked, comments]);

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        Loading post...
      </div>
    );
  }

  if (empty) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 text-xl">
        No post found 😢
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center px-6 py-10">
      {/* Glowing particle background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] [background-size:30px_30px] animate-pulse" />
      </div>

      {/* Post Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Post Image */}
        <motion.figure
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img
            src={post.picture}
            alt="Post"
            className="w-full max-h-[450px] object-cover rounded-t-2xl"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-xl text-white text-sm">
            📍 {post.location.name}
          </div>
        </motion.figure>

        {/* Post Content */}
        <div className="p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-300 mb-4">{post.description}</p>

          <div className="flex flex-wrap gap-6 mb-6">
            <span className="px-4 py-2 bg-gray-800 rounded-lg">
              👤 Posted by: <Link to={`/profile/${postAuthor}`}><b className="underline">{postAuthor}</b></Link>
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-lg">
              ⭐ {post.rating} / 5
            </span>
          </div>

          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <iframe
              className="w-full h-80 rounded-xl"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${post.location.lat},${post.location.long}&t=&z=15&ie=UTF8&iwloc=&output=embed&maptype=satellite`}
            />
          </motion.div>
        </div>

        {/* Interaction buttons (social feel) */}
        <div className="flex justify-around items-center py-4 border-t border-gray-700 bg-black/30">
          {!isLoggedIn ? (<div>Login first to interact with the post</div>):(<div><button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg text-white transition " onClick={async function () {
              let user_id = (await axios.get(`http://localhost:5002/user/${user}`)).data._id
              if (!liked) {
                await axios.post("http://localhost:5002/post/add_like", {
                  "user_id": user_id,
                  "post_id": id
                });
                doLike(true);
              } else {
                await axios.post("http://localhost:5173/post/" + id, {
                  "user_id": user_id,
                  "post_id": id
                });
                doLike(false);
              }
            }}>
            {liked ? (<div>👎</div>) : (<div>👍 </div>)}
          </button>
          <button className="ml-3 px-6 py-2 bg-pink-600 hover:bg-pink-500 rounded-full shadow-lg text-white transition" onClick={() => navigate(`/add_comment/${id}`)}>
            💬 Comment
          </button>
          <button className="ml-3 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-full shadow-lg text-white transition" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Post link copied to clipboard");
          }}>
            ↗️ Share
          </button>
          {user == postAuthor ? (<button className="ml-3 px-6 py-2 bg-red-400 hover:bg-red-450 rounded-full shadow-lg text-white transition" onClick={async () => {
            await axios.post("http://localhost:5002/post/delete", {"id": id});
            toast.success("Post Removed");
            navigate(`/profile/${user}`);
          }}>
            ❌ Delete Post
          </button>) : null}
          
          </div>)}
        </div>
        {/* comments */}
        <div>
          {comments.map(comment => (<div key={comment._id}> Comment By: {comment.username} Comment: {comment.comment} <button onClick={async () => {
            await axios.post("http://localhost:5002/comments/delete", {"id": comment._id});
            toast.success("Comment Deleted");
            add_comment([]);
          }}>Delete</button></div>))}
        </div>
      </motion.div>
    </div>
  );

}