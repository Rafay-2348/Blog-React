import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import AddBlog from './AddBlog';
import UserBlog from './UserBlog.';

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />, // message prho c
      },
      {
        path: "addblog",
        element: <AddBlog />,
      },
      {
        path: "userblog",
        element: <UserBlog />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

