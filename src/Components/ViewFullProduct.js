import axios from "axios";
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
import Spinner from "./Spinner";

function ViewFullProduct(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [product, setProduct] = useState();

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const productCollectionRef = doc(db, "Products", id);

  const nav=useNavigate()

  if (user==undefined || user.uid == undefined) {
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
       // console.log(userr);
        const getUser = async () => {
          const userRef = doc(db, "Users", userr.uid);
          const data = await getDoc(userRef);
          setUser({...data.data(),uid:userr.uid})
        };
        getUser();
      } else {
        nav('/login')
      }
    });
  }

  useEffect(() => {
    const getProduct = async () => {
      const data = await getDoc(productCollectionRef);
      console.log(data.data());
      setProduct(data.data());
    };

    getProduct();
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
    <>
    {
      product !== undefined ? (
        <div>
        <Card>
          <p style={{ alignContent: "center" }}>
            <Card.Img
              variant="top"
              src={product.image}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          </p>
          <Card.Body>
            <Card.Text>{product.title}</Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card>
          <Card.Body>
            <Card.Text>{product.description}</Card.Text>
          </Card.Body>
          <Button variant="primary" type="submit" onClick={handleCart}>
            Add to Cart
          </Button>
        </Card>
      </div>
      ) : (
        <Spinner/>
      )
    }
    </>
  );
}

export default ViewFullProduct;
