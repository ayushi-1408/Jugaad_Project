import { getAuth, signOut } from "firebase/auth";
import React, { useContext } from "react";
import { Button, Dropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Logout from "./Logout";
import {ic_local_grocery_store} from 'react-icons-kit/md/ic_local_grocery_store'
import {ic_person} from 'react-icons-kit/md/ic_person'
import Icon from "react-icons-kit";
import {ic_favorite} from 'react-icons-kit/md/ic_favorite'
import {ic_exit_to_app} from 'react-icons-kit/md/ic_exit_to_app'

function Navigationbar() {
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("logged out");
        setUser();
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
    nav("/");
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="route-outlet fixed-top"
      >
        <Container className="m-auto">
          <Navbar.Brand className="" href="/">
            JUGAAD
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto ms-1">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >
                About Us
              </Link>
              <Link
                to="/products"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >
                Products
              </Link>
              <Link
                to="/blogs"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >
                Blogs
              </Link>
              <Link
                to="/events"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >
                Events
              </Link>
            </Nav>
            <Nav className="me-1 d-flex justify-self-end">
              {user !== undefined && user.uid !== undefined ? (
                <>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="circle-singleline" style={{width:"60px"}}>
                    <Icon icon={ic_person} size="25"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1" ><Link to={`/userProfile/${user.uid}/`} style={{textDecoration:"none", color:"black", fontWeight:"bold"}}><Icon icon={ic_person}/> Profile</Link></Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                      <Link to={`/cart`} style={{textDecoration:"none", color:"black", fontWeight:"bold"}}><Icon icon={ic_local_grocery_store}/> Cart</Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3">
                      <Link to={`/userProfile/${user.uid}/`} style={{textDecoration:"none", color:"black", fontWeight:"bold"}}><Icon icon={ic_favorite}/> WishList</Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                      <Link style={{textDecoration:"none", color:"black", fontWeight:"bold"}}><div onClick={handleLogout}><Icon icon={ic_exit_to_app}/> Logout</div></Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Link
                  id="login"
                  to="/login"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Login/Signup
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default Navigationbar;
