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
  arrayRemove,
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

  const [addToCart, setStateCart ] = useState(true);
  const [addToWishList, setStateWishList ] = useState(true);

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
      //console.log(user.Cart)
      const data = await getDoc(productCollectionRef);
      if(user.Cart !== undefined && user.Cart.length > 0 ) user.Cart.forEach((product) => id === product.product ? setStateCart(false) : console.log())
      if(user.WishPID !== undefined && user.WishPID.length > 0 ) user.WishPID.forEach((product) => id === product ? setStateWishList(false) : console.log())
      setProduct(data.data());
      
    };

    getProduct();
  }, [!user]);

  const handleCart = () => {
    
    const userRef = doc(db, "Users", user.uid);
    const addToCart = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        Cart: arrayUnion({product:id, quantity:1}),
      });
      setStateCart(false);
    };
    addToCart();
  };

  const addWishList = () => {
    
    const userRef = doc(db, "Users", user.uid);
    const addToWishList = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        WishPID: arrayUnion(id),
      });
      setStateWishList(false);
    };

    addToWishList();
  };

  const removeWishList = () => {
    
    const userRef = doc(db, "Users", user.uid);
    const remWishList = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        WishPID: arrayRemove(id),
      });
      setStateWishList(true);
    };

    remWishList();
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
          {
            addToCart === true ? (
              <Button variant="primary" type="submit" onClick={handleCart}>
            Add to Cart
          </Button>
            ) : (
              <Button variant="light " disabled type="submit" >
            Added to Cart
          </Button>
            )
          }
          {
            addToWishList === true ? (
              <Button variant="light" type="submit" onClick={addWishList}>
            Add to WishList
          </Button>
            ) : (
              <Button variant="dark " type="submit" onClick={removeWishList}>
            Remove from WishList
          </Button>
            )
          }
          <Link to={`/userProfile/${product.UID}/`} reloadDocument="true">
          <Button variant="primary " type="submit" >
            View this user profile
          </Button>
          </Link>
          
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
