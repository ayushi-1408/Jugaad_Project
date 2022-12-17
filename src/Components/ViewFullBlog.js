import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function ViewFullBlog(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [blog, setblog] = useState([]);

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const blogCollectionRef = doc(db, "Blogs", id);

  const nav=useNavigate()

    if(!user) {
      onAuthStateChanged(auth, (userr) => {
        if (userr) {
          console.log(userr)
          setUser(userr.uid)
        } else {
          console.log("not signed")
          nav('/login')
        }
      });
    }

  console.log(user);

  useEffect(() => {
    const getblog = async () => {
      const data = await getDoc(blogCollectionRef);
      console.log(data.data());
      setblog(data.data());
    };

    getblog();
  }, []);

  const handleCart = () => {
    console.log(auth.currentUser);
    const userRef = doc(db, "Users", user);
    const addToCart = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        Cart: arrayUnion(id),
      });
      console.log("updated cart");
    };

    addToCart();
  };

  return (
    <div>
      <Card>
        <p style={{ alignContent: "center" }}>
          <Card.Img
            variant="top"
            src={blog.image}
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        </p>
        <Card.Body>
          <Card.Text>{blog.title}</Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <Card.Text>{blog.description}</Card.Text>
        </Card.Body>
        <Button variant="primary" type="submit" onClick={handleCart}>
          Add to Cart
        </Button>
      </Card>
    </div>
  );
}

export default ViewFullBlog;
