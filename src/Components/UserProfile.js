import { getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import { db } from "../firebase-config";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBRipple,
} from "mdb-react-ui-kit";
import Spinner from "./Spinner";

export default function UserProfile(props) {
  const param = useParams();
  const { id } = param;
  console.log("User to be seen " + id);

  const { user, setUser } = useContext(UserContext);

  const [viewUserProfile, setViewUserProfile] = useState();

  console.log(user);
  console.log(viewUserProfile);

  const [myBlogs, setMyBlogs] = useState();
  const [myProducts, setMyProducts] = useState();
  const [myEvents, setMyEvents] = useState();

  const [savedBlogs, setSavedBlogs] = useState();
  const [wishList, setWishList] = useState();
  const [savedEvents, setSavedEvents] = useState();

  const [connect, setConnect ] = useState();

  const auth = getAuth();

  const nav = useNavigate();

  if (user === undefined) {
    console.log("0");
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
        const getUser = async () => {
          const userRef = doc(db, "Users", userr.uid);
          const data = await getDoc(userRef);
          setUser({ ...data.data(), uid: userr.uid });
        };
        getUser();
      } else {
        nav("/login");
      }
    });
  }

  useEffect(() => {
    const getProfile = async () => {
      if (user.uid === id) {
        setViewUserProfile({ ...user });
        setConnect("none")
      } else {
        const userRef = doc(db, "Users", id);
        const dataa = await getDoc(userRef);
        setViewUserProfile({ ...dataa.data() });
        if(user.requestsMade &&  user.requestsMade.includes(id)) setConnect("sent")
        else if(user.requestsReceived && user.requestsReceived.includes(id)) setConnect("received")
        else if(user.connected && user.connected.includes(id)) setConnect("connected")
        else setConnect("connect")
      }
    };

    if (user !== undefined) getProfile();
  }, [id, user]);

  useEffect(() => {
    console.log("enetered in useeffect");
    const getData = async () => {
      console.log("entered in getdata");
      //MyProducts
      // if (myProducts === undefined) {
      setMyProducts([]);
      console.log("MYProducts");
      if (viewUserProfile.PID !== undefined)
        viewUserProfile.PID.forEach((element) => {
          console.log("Hey2");
          const productCollectionRef = doc(db, "Products", element);
          const getProduct = async () => {
            const data = await getDoc(productCollectionRef);
            const temp = data.data();
            // console.log(temp)
            temp.pid = element;
            setMyProducts((arr) => [...arr, temp]);
            console.log(myProducts);
          };
          getProduct();
        });
      // }

      //WishList
      // if (wishList === undefined) {
      setWishList([]);
      console.log("wishlist");
      if (viewUserProfile.WishPID !== undefined)
        viewUserProfile.WishPID.forEach((element) => {
          console.log("hey1");
          const productCollectionRef = doc(db, "Products", element);
          const getProduct = async () => {
            const data = await getDoc(productCollectionRef);
            const temp = data.data();
            //console.log(temp)
            temp.pid = element;
            setWishList((arr) => [...arr, temp]);
          };
          getProduct();
        });
      // }

      //MyBlogs
      //if (myBlogs === undefined) {
      setMyBlogs([]);
      if (viewUserProfile.BID !== undefined)
        viewUserProfile.BID.forEach((element) => {
          const blogCollectionRef = doc(db, "Blogs", element);
          const getBlog = async () => {
            const data = await getDoc(blogCollectionRef);
            const temp = data.data();
            // console.log(temp)
            temp.bid = element;
            setMyBlogs((arr) => [...arr, temp]);
            console.log(myBlogs);
          };
          getBlog();
        });
      //}

      //MyEvents
      // if (myEvents === undefined) {
      setMyEvents([]);
      if (viewUserProfile.BID !== undefined)
        viewUserProfile.EID.forEach((element) => {
          //console.log(element)
          const eventCollectionRef = doc(db, "Events", element);
          const getEvent = async () => {
            const data = await getDoc(eventCollectionRef);
            const temp = data.data();
            //console.log(data.data());
            temp.eid = element;
            setMyEvents((arr) => [...arr, temp]);
            console.log(myEvents);
          };
          getEvent();
        });
      //}

      //saved blogs
      //if (savedBlogs === undefined) {
      setSavedBlogs([]);
      if (viewUserProfile.SavedBID !== undefined)
        viewUserProfile.SavedBID.forEach((element) => {
          const blogCollectionRef = doc(db, "Blogs", element);
          const getBlog = async () => {
            const data = await getDoc(blogCollectionRef);
            const temp = data.data();
            //console.log(temp)
            temp.bid = element;
            setSavedBlogs((arr) => [...arr, temp]);
          };
          getBlog();
        });
      //}

      //saved events
      // if (savedEvents === undefined) {
      setSavedEvents([]);
      if (viewUserProfile.SavedEID !== undefined)
        viewUserProfile.SavedEID.forEach((element) => {
          const eventCollectionRef = doc(db, "Events", element);
          const getEvent = async () => {
            const data = await getDoc(eventCollectionRef);
            const temp = data.data();
            //console.log(temp)
            temp.eid = element.product;
            setSavedEvents((arr) => [...arr, temp]);
          };
          getEvent();
        });
      //}
    };
    if (user !== undefined && viewUserProfile !== undefined) {
      getData();
    }
  }, [viewUserProfile]);



  // connection handlers

  const handleAcceptRequest = (e) => {
    e.preventDefault();
    const getUser = async () => {
      updateDoc(doc(db, "Users", user.uid), {
        requestsReceived: arrayRemove(id),
        connected: arrayUnion(id),
      });
      updateDoc(doc(db, "Users", id), {
        requestsMade: arrayRemove(user.uid),
        connected: arrayUnion(user.uid),
      });
      setConnect("connected")
    };
    getUser();
  };

  const handleDeleteRequest = (e) => {
    e.preventDefault();
    const getUser = async () => {
      updateDoc(doc(db, "Users", user.uid), {
        requestsReceived: arrayRemove(id),
      });
      updateDoc(doc(db, "Users", id), {
        requestsMade: arrayRemove(user.uid),
      });
      setConnect("connect")
    };
    getUser();
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    const getUser = async () => {
      updateDoc(doc(db, "Users", user.uid), {
        requestsMade: arrayUnion(id),
      });
      updateDoc(doc(db, "Users", id), {
        requestsReceived: arrayUnion(user.uid),
      });
      setConnect("sent")
    };
    getUser();
  };

  const handleUnsendRequest = (e) => {
    e.preventDefault();
    const getUser = async () => {
      updateDoc(doc(db, "Users", user.uid), {
        requestsMade: arrayRemove(id),
      });
      updateDoc(doc(db, "Users", id), {
        requestsReceived: arrayRemove(user.uid),
      });
      setConnect("connect")
    };
    getUser();
  };

  return (
    <>
      {viewUserProfile !== undefined ? (
        <div
          className="gradient-custom-2"
          style={{ backgroundColor: "#9de2ff" }}
        >
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="9" xl="7">
              <Link
                to="/addProduct"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >Add New Product</Link>
              <Link
                to="/addBlog"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >Add new Blog</Link>
              <Link
                to="/addEvent"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "15px",
                }}
              >Add New Event</Link>
                <MDBCard>
                  
                  <div
                    className="rounded-top text-white d-flex flex-row"
                    style={{ backgroundColor: "#000", height: "200px" }}
                  >
                    
                    <div
                      className="ms-4 mt-5 d-flex flex-column"
                      style={{ width: "150px" }}
                    >
                      <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                        alt="Generic placeholder image"
                        className="mt-4 mb-2 img-thumbnail"
                        fluid
                        style={{ width: "150px", zIndex: "1" }}
                      />
                      <MDBBtn
                        outline
                        color="dark"
                        style={{ height: "36px", overflow: "visible" }}
                      >
                        Edit profile
                      </MDBBtn>
                    </div>
                    <div className="ms-3" style={{ marginTop: "130px" }}>
                      <MDBTypography tag="h5">
                        {viewUserProfile.name}
                      </MDBTypography>
                      <MDBCardText>Place</MDBCardText>
                    </div>
                  </div>
                  <div
                    className="p-4 text-black"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="d-flex justify-content-end text-center py-1">
                      <div>
                        <MDBCardText className="mb-1 h5">253</MDBCardText>
                        <MDBCardText className="small text-muted mb-0">
                          Photos
                        </MDBCardText>
                      </div>
                      <div className="px-3">
                        <MDBCardText className="mb-1 h5">1026</MDBCardText>
                        <MDBCardText className="small text-muted mb-0">
                          Followers
                        </MDBCardText>
                      </div>
                      <div>
                        <MDBCardText className="mb-1 h5">478</MDBCardText>
                        <MDBCardText className="small text-muted mb-0">
                          Following
                        </MDBCardText>
                      </div>
                    </div>
                  </div>
                  <MDBCardBody className="text-black p-4">
                    <div className="mb-5">
                      <p className="lead fw-normal mb-1">About</p>
                      <div
                        className="p-4"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <MDBCardText className="font-italic mb-1">
                          {viewUserProfile.description}
                        </MDBCardText>
                        {/* <MDBCardText className="font-italic mb-1">Lives in New York</MDBCardText>
                    <MDBCardText className="font-italic mb-0">Photographer</MDBCardText> */}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <MDBCardText className="lead fw-normal mb-0">
                        Recent Blogs
                      </MDBCardText>
                      <MDBCardText className="mb-0">
                        <a href="#!" className="text-muted">
                          Show all
                        </a>
                      </MDBCardText>
                    </div>
                    <MDBRow>
                      <MDBCol className="mb-2">
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                          alt="image 1"
                          className="w-100 rounded-3"
                        />
                      </MDBCol>
                      <MDBCol className="mb-2">
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                          alt="image 1"
                          className="w-100 rounded-3"
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="g-2">
                      <MDBCol className="mb-2">
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                          alt="image 1"
                          className="w-100 rounded-3"
                        />
                      </MDBCol>
                      <MDBCol className="mb-2">
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                          alt="image 1"
                          className="w-100 rounded-3"
                        />
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>

          {myProducts !== undefined && myProducts.length !== 0 ? (
            <MDBContainer fluid className="my-5 text-center">
              <h4 className="mt-4 mb-5">
                {id === user.uid ? (
                  <strong> My Products</strong>
                ) : (
                  <strong> {viewUserProfile.name}'s Products</strong>
                )}
              </h4>

              <MDBRow>
                {myProducts.map((product) => (
                  <MDBCol md="12" lg="4" className="mb-4" key={product.pid}>
                    <MDBCard>
                      <MDBRipple
                        rippleColor="light"
                        rippleTag="div"
                        className="bg-image rounded hover-zoom"
                      >
                        <MDBCardImage
                          src={product.image}
                          fluid
                          className="w-100"
                        />
                        <Link to={`/viewProduct/${product.pid}`}>
                          <div className="mask">
                            <div className="d-flex justify-content-start align-items-end h-100">
                              <h5>
                                <span className="badge bg-primary ms-2">
                                  New
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="hover-overlay">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.15)",
                              }}
                            ></div>
                          </div>
                        </Link>
                      </MDBRipple>
                      <MDBCardBody>
                        <Link
                          to={`/viewProduct/${product.pid}`}
                          className="text-reset"
                        >
                          <h5 className="card-title mb-3">{product.title}</h5>
                        </Link>
                        <Link
                          to={`/viewProduct/${product.pid}`}
                          className="text-reset"
                        >
                          <p>Category</p>
                        </Link>
                        <h6 className="mb-3">${product.price}</h6>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
            </MDBContainer>
          ) : (
            <></>
          )}

          { user.uid === id && wishList !== undefined && wishList.length !== 0 ? (
            <MDBContainer fluid className="my-5 text-center">
              <h4 className="mt-4 mb-5">
                <strong> My Wishlist</strong> : <></>
              </h4>

              <MDBRow>
                {wishList.map((product) => (
                  <MDBCol md="12" lg="4" className="mb-4" key={product.pid}>
                    <MDBCard>
                      <MDBRipple
                        rippleColor="light"
                        rippleTag="div"
                        className="bg-image rounded hover-zoom"
                      >
                        <MDBCardImage
                          src={product.image}
                          fluid
                          className="w-100"
                        />
                        <Link to={`/viewProduct/${product.pid}`}>
                          <div className="mask">
                            <div className="d-flex justify-content-start align-items-end h-100">
                              <h5>
                                <span className="badge bg-primary ms-2">
                                  New
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="hover-overlay">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.15)",
                              }}
                            ></div>
                          </div>
                        </Link>
                      </MDBRipple>
                      <MDBCardBody>
                        <Link
                          to={`/viewProduct/${product.pid}`}
                          className="text-reset"
                        >
                          <h5 className="card-title mb-3">{product.title}</h5>
                        </Link>
                        <Link
                          to={`/viewProduct/${product.pid}`}
                          className="text-reset"
                        >
                          <p>Category</p>
                        </Link>
                        <h6 className="mb-3">${product.price}</h6>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
            </MDBContainer>
          ) : (
            <></>
          )}
          
          {user.uid !== id ? (
            connect === "sent" ? (
              <Button variant="light" onClick={handleUnsendRequest}>
                Unsend Request
              </Button>
            ) : connect === "received" ? (
              <>
                <Button variant="primary" onClick={handleAcceptRequest}>
                  AcceptRequest
                </Button>
                <Button variant="danger" onClick={handleDeleteRequest}>
                  Delete Request
                </Button>
              </>
            ) :  connect === "connect" ? ( 
              <Button variant="primary" onClick={handleSendRequest}>
                Send Request
              </Button>
            ) : connect === "connected" ? (
              <Button variant="light" disabled >
                Connected
              </Button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
