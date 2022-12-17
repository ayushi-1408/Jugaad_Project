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
import Appa from "./Components/footer";
function App() {
  const [user, setUser] = useState();
  
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigationbar />}>
              <Route index element={<HomePage />} />
              
              <Route path="login" element={<LoginSignup />} />
              <Route path="cart" element={<Cart />} />
              <Route path="about" element={<About />} />
              <Route path="events" element={<Events />} />
              <Route path="addEvent" element={<AddEvent />} />
              <Route path="addBlog" element={<AddBlog />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="placeOrder/:id" element={<PlaceOrder />} />
              <Route path="events" element={<Events />} />
              <Route path="products" element={<Products />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="newUser" element={<NewUser />} />
              <Route path="userProfile" element={<UserProfile />} />
              <Route path="viewBlog/:id" element={<ViewFullProduct />} />
              <Route path="viewProduct/:id" element={<ViewFullProduct />} />
            </Route>
            
          </Routes>
        </BrowserRouter>
        
      </UserContext.Provider>
    </div>
  );
}

export default App;
