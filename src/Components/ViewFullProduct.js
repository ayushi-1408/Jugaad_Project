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
import { Carousel } from "react-bootstrap";

function ViewFullProduct(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [product, setProduct] = useState();

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [addToCart, setStateCart ] = useState(true);
  const [addToWishList, setStateWishList ] = useState(true);

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
      const productCollectionRef = doc(db, "Products", id);
      const data = await getDoc(productCollectionRef);
      if(user.Cart !== undefined && user.Cart.length > 0 ) user.Cart.forEach((product) => id === product.product ? setStateCart(false) : console.log())
      if(user.WishPID !== undefined && user.WishPID.length > 0 ) user.WishPID.forEach((product) => id === product ? setStateWishList(false) : console.log())
      setProduct(data.data());
      
    };

    if(user !== undefined) getProduct();
  }, [id,user]);

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

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  return (
    <>
    {
      product !== undefined ? (
        <div>
        <Card>
          <div style={{ alignContent: "center", margin:"20px" }}>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {
               product.MediaID !== undefined && product.MediaID.length !== 0 ? (
                product.MediaID.map((element) => (
                      <Carousel.Item key={element}>
                      <img
                        className="d-block w-100"
                        src={element}
                        alt="First slide"
                      />
                    </Carousel.Item>
                    ))
              ) : (
                <Card.Img
                  variant="top"
                  src={ require('../no_image.png') }
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              )
            }
          
               
              
      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://firebasestorage.googleapis.com/v0/b/jugaad-70ee9.appspot.com/o/images%2FScreenshot%20(5).png?alt=media&token=ab119342-b0d2-4d8a-b03d-eb489ee80d74"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://firebasestorage.googleapis.com/v0/b/jugaad-70ee9.appspot.com/o/images%2FScreenshot%20(3).png?alt=media&token=7056914a-5746-4425-a218-0cd90753d581"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>
          </div>
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
          <Link to={`/userProfile/${product.UID}/`} >
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
