import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected/Protected";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup/Signup";
import SubmitBlog from "./pages/SubmitBlog/SubmitBlog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import UpdateBlog from "./pages/UpdateBlog/UpdateBlog";
import useAutoLogin from "./hooks/useAutoLogin";
import Loader from "./components/Loader/Loader";

function App() {
  const isAuth = useSelector((state) => state.user.auth);

  const loading = useAutoLogin();

  return loading ? (
    <Loader text="..." />
  ) : (
    <div>
      
      <BrowserRouter>
        <div>
          <Navbar />
          <div className="container" style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/about-us" exact element={<AboutUs />} />
              <Route path="/contact-us" exact element={<ContactUs />} />
              <Route
                path="/submit-blog"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    <SubmitBlog />
                  </Protected>
                }
              />
              <Route
                path="/blog/:id"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    {" "}
                    <BlogDetails />{" "}
                  </Protected>
                }
              />
              <Route path="/blogUpdate/:id" exact element={<UpdateBlog />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="*" exact element={<div>Error page</div>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
