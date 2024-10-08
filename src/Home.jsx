import React, { useEffect, useState } from 'react'
import { getUserBlogs } from './config/function';

const Home = () => {
  const [blog , setBlog] = useState([]);
  useEffect(() => {
  async  function getBlog() {
      const {allUserData} = await getUserBlogs("","Blog");
    setBlog(allUserData);
    }
    getBlog();
  }, [])


  return (
    <div className="container mx-auto p-4">
    {blog ? blog.map((item, index) => (
      <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <img
          src={item.blogUrl}
          alt="blogimage"
          className="w-full h-64 object-cover rounded-t-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.blogTitle}</h2>
        <p className="text-gray-600">{item.blogMessage}</p>
      </div>
    )) : (
      <div className="text-center text-gray-500">
        Loading...
      </div>
    )}
  </div>
  
  )
}

export default Home
