import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Icon } from 'react-icons-kit'
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {ic_add_shopping_cart} from 'react-icons-kit/md/ic_add_shopping_cart'
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import {heart} from 'react-icons-kit/fa/heart'
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
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
           <MDBContainer fluid className="bg-success ">
        <MDBRow className="d-flex justify-content-center align-items-center ">
          <MDBCol lg="9" className="mt-5">
            <h1 class="mb-4">{product.title}</h1>
</MDBCol>
</MDBRow>
</MDBContainer>
        <Card className="mx-3 my-2">
          <Carousel className="w-50" style={{ alignSelf: "center", margin:"20px" }}  activeIndex={index} onSelect={handleSelect}>
            {
               product.MediaID !== undefined && product.MediaID.length !== 0 ? (
                product.MediaID.map((element) => (
                      <Carousel.Item key={element}>
                      <img
                        className="d-block w-100"
                        src={element}
                        alt="First slide"
                        style={{objectFit:"contain", width:"300px", height:"400px"}}
                      />
                    </Carousel.Item>
                    ))
              ) : (

                <Card.Img
                  variant="top"
                  src={ require('../default_image.webp') }
                  //style={{ maxWidth: "100px", maxHeight: "100px" }}
                  className="w-100"
                />
              )
            }
        
    </Carousel>
          
        </Card>
        
        <Card className="mx-3 my-2">
          <Card.Body>
            <Card.Title>Description</Card.Title>
            <Card.Text>{product.description}</Card.Text>
          </Card.Body>
          </Card>

        
          {
            addToCart === true ? (
              <>
              <div className=' mx-md-n5 mb-3' >
                    <MDBBtn  color="primary" size="sm" type="submit"  onClick={handleCart}>
                    <Icon  icon={ic_add_shopping_cart}/>
                     Add to Cart
                    </MDBBtn>  
                    </div>    
          </>
            ) : (
              <>
               <div className=' mx-md-n5 mb-3' >
                    <MDBBtn outline color="primary" size="sm"  disabled type="submit"  variant="light " style={{border:"1px solid"}}>
                    <Icon  icon={ic_add_shopping_cart}/>
                    Added to Cart
                    </MDBBtn>
                    </div>
              
          </>
            )
          }
          {
            addToWishList === true ? (
              <>
              <div className=' mx-md-n5 mb-3' >
                <MDBBtn  color='danger' size="sm" type="submit" onClick={addWishList}>
                <Icon  icon={heart}/>
                 Add to Wishlist
                </MDBBtn>
             </div>
          </>
            ) : (
              <div className=' mx-md-n5 mb-3' >
              <MDBBtn variant="light" size="sm" color="danger" type="submit"  onClick={removeWishList} style={{border:"1px solid"}}>
              <Icon  icon={heart}/>
            Remove from WishList
          </MDBBtn>
          </div>

            )
          }
          <Link to={`/userProfile/${product.UID}/`} >
          <Button variant="primary " type="submit" >
            View this user profile
          </Button>
          </Link>
          
       
      </div>
      ) : (
        <Spinner/>
      )
    }
    <br/>
    </>

  );
}

export default ViewFullProduct;
