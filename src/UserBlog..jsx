import React, { useEffect, useState } from "react";
import { getUserBlogs, updateUserBlog, deleteUserBlog } from "./config/function"; // Add appropriate functions for edit/delete
import { auth, onAuthStateChanged } from "./config/firebase";
import { Triangle } from "react-loader-spinner";

const UserBlog = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  async function getUserBlogsData() {
    const { singleUserData } = await getUserBlogs(user.uid, "Blog");
    setBlogs(singleUserData);
  }

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getUserBlogsData(currentUser.uid);
      } else {
        setUser(null);
        setBlogs([]); // Clear blogs when user signs out
        console.log("User is signed out");
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [user]);

  // Function to handle editing a blog
  const handleEdit = async (blogId) => {
    const newTitle = prompt("Enter new blog title:");
    const newMessage = prompt("Enter new blog message:");
    if (newTitle && newMessage) {
      await updateUserBlog(blogId, { blogTitle: newTitle, blogMessage: newMessage });
      getUserBlogsData(user.uid); // Fetch the updated blogs
    }
  };

  // Function to handle deleting a blog
  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteUserBlog(blogId);
      getUserBlogsData(user.uid); // Fetch updated blogs after deletion
    }
  };

  return (
    
    <div className="container mx-auto p-4">
      {user ? (
        blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <img
                src={blog.blogUrl}
                alt="blogimage"
                className="w-full h-64 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {blog.blogTitle}
              </h2>
              <p className="text-gray-600 mb-4">{blog.blogMessage}</p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(blog.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No blogs found.</p>
        )
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default UserBlog;
