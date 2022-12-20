import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Redirect,
  Navigate,
} from "react-router-dom";
import Products from "./Components/Products";
import Navigationbar from "./Components/Navigationbar";
import Events from "./Components/Events";
import About from "./Components/About";
import Blogs from "./Components/Blogs";
import HomePage from "./Components/HomePage";
import ChatPage from "./Components/ChatPage";
import ViewFullProduct from "./Components/ViewFullProduct";
import AddProduct from "./Components/AddProduct";
import NewUser from "./Components/NewUser";
import UserProfile from "./Components/UserProfile";
import UserState from "./Contexts/userState";
import UserContext from "./Contexts/UserContext";
import LoginSignup from "./Components/LoginSignup";
import Cart from "./Components/Cart";
import AddEvent from "./Components/AddEvent";
import PlaceOrder from "./Components/PlaceOrder";
import { useState } from "react";
import AddBlog from "./Components/AddBlog";
import FooterPart from "./Components/footer";
import ProductContext from "./Contexts/ProductsContext";
import BlogsContext from "./Contexts/BlogsContext";
import EventsContext from "./Contexts/EventsContext";
import OrderContext from "./Contexts/OrderContext";
import ViewFullBlog from "./Components/ViewFullBlog";

function App() {
  const [user, setUser] = useState();
  const [products, setProducts] = useState();
  const [blogs, setBlogs] = useState();
  const [events, setEvents] = useState();
  const [order, setOrder] = useState();

  // harshita.1470@gmail.com
  
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
      <ProductContext.Provider value={{ products, setProducts }}>
      <BlogsContext.Provider value={{ blogs, setBlogs }}>
      <EventsContext.Provider value={{events, setEvents }}>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigationbar />}>
              <Route index element={<HomePage />} />
              
              <Route path="login" element={<LoginSignup />} />
              <Route path="about" element={<About />} />
              <Route path="events" element={<Events />} />
              <Route path="addEvent" element={<AddEvent />} />
              <Route path="addBlog" element={<AddBlog />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="events" element={<Events />} />
              <Route path="products" element={<Products />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="newUser" element={<NewUser />} />
              <Route path="userProfile" element={<UserProfile />} />
              <Route path="viewBlog/:id" element={<ViewFullBlog />} />
              <Route path="viewProduct/:id" element={<ViewFullProduct />} />

              <Route path="cart" element={<Cart />} />
              <Route path="placeOrder" element={<PlaceOrder />} />

            </Route>
            
          </Routes>
          <FooterPart/>
        </BrowserRouter>
      </EventsContext.Provider>
      </BlogsContext.Provider>
      </ProductContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
