import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Context";
import { Post } from "./Post";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router";

export const Homepage = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);

  // Load user posts
  useEffect(() => {
    if (isLoggedIn) {
      async function load_data() {
        let response = await axios.post("http://localhost:5002/fyp/", { username: user });
        let data = response.data;
        if (data.message === "No posts found") setEmpty(true);
        else setPosts(data);
        setLoaded(true);
      }
      load_data();
    }
  }, [isLoggedIn, user]);

  // Logged-in feed
  if (isLoggedIn) {
    if (!loaded) {
      return (
        <div className="h-screen flex items-center justify-center text-xl font-semibold text-gray-300 animate-pulse">
          Feed is loading...
        </div>
      );
    }

    if (empty) {
      return (
        <div className="h-screen flex items-center justify-center text-xl font-semibold text-gray-400 animate-fade-in">
          Your feed is empty
        </div>
      );
    }

    return (
      <div
        className="h-screen w-screen relative flex justify-center bg-gray-900/50 backdrop-blur-sm overflow-y-auto py-8"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Two column layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left: posts feed */}
          <div className="col-span-2 flex flex-col gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 text-white hover:shadow-2xl transition">
                  <Post data={post} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: empty sidebar */}
          <div className="hidden md:block col-span-1">
            {/* Blank for now (like the screenshot) */}
          </div>
        </motion.div>
      </div>
    );
  }

  // Landing page for guests
  return (
    <div
      className="h-screen w-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="animated-gradient absolute inset-0 opacity-50"></div>
      <div className="overlay"></div>

      {/* Content */}
      <div className="relative z-10 flex w-full h-full items-center justify-between px-20">
        <div className="max-w-lg text-white animate-slide-in-left">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in-delay">
            Share your travel experiences
          </h1>
          <p className="text-lg text-gray-200 animate-fade-in-delay">
            Join our community and connect with travel enthusiasts from around
            the world
          </p>
        </div>

        <div className="login-card animate-bounce-slow">
          <h2 className="text-2xl font-bold mb-6">Welcome to Wandergram</h2>
          <Link to="/login" className="text-blue-800"> Login First </Link>
        </div>
      </div>
    </div>
  );
};
