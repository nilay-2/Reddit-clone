import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./pages/Home/App";
import Header from "./pages/Home/Header";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import CreatePost from "./pages/Post/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protect from "./Components/Protect";
// routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />, // here Header component is the root layout
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "submit",
        element: <Protect children={<CreatePost />} />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
