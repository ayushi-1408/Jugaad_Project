import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Spinner from "./Spinner";

export default function UserProfile(props) {
  const [scrollableModal, setScrollableModal] = useState(false);
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

  const [connect, setConnect] = useState();

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
        setConnect("none");
      } else {
        const userRef = doc(db, "Users", id);
        const dataa = await getDoc(userRef);
        setViewUserProfile({ ...dataa.data() });
        console.log(user.connected);
        if (user.requestsMade && user.requestsMade.includes(id))
          setConnect("sent");
        else if (user.requestsReceived && user.requestsReceived.includes(id))
          setConnect("received");
        else if (
          user.connected &&
          user.connected.some((element) => {
            if (element.UID === id && element.name === dataa.data().name)
              return true;
            else return false;
          })
        )
          setConnect("connected");
        else setConnect("connect");
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
        connected: arrayUnion({
          UID: id,
          name: viewUserProfile.name,
        }),
      });
      updateDoc(doc(db, "Users", id), {
        requestsMade: arrayRemove(user.uid),
        connected: arrayUnion({
          UID: user.uid,
          name: user.name,
        }),
      });
      setConnect("connected");
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
      setConnect("connect");
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
      setConnect("sent");
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
      setConnect("connect");
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
          <div style={{ paddingTop: "5px" }}>
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
              ) : connect === "connect" ? (
                <Button variant="primary" className="mr-1" onClick={handleSendRequest}>
                  Send Request
                </Button>
              ) : connect === "connected" ? (
                <Button variant="light" disabled>
                  Connected
                </Button>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </div>

          <MDBContainer className="py-2 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="9" xl="7">
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
                        src={
                          viewUserProfile.image !== undefined
                            ? viewUserProfile.image
                            : require("../default_image.webp")
                        }
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
                    </div>
                  </div>
                  <div
                    className="p-4 text-black"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="d-flex justify-content-end text-center py-1 mx-5">
                      <div className="px-3">
                        <MDBCardText
                          className="mb-1 h5"
                          role="button"
                          onClick={() => setScrollableModal(!scrollableModal)}
                        >
                          {viewUserProfile.connected.length}
                        </MDBCardText>
                        <MDBCardText
                          className="small text-muted mb-0"
                          role="button"
                          onClick={() => setScrollableModal(!scrollableModal)}
                        >
                          Connections
                        </MDBCardText>
                      </div>
                      <MDBModal
                        show={scrollableModal}
                        setShow={setScrollableModal}
                        tabIndex="-1"
                      >
                        <MDBModalDialog scrollable>
                          <MDBModalContent>
                            <MDBModalHeader>
                              <MDBModalTitle>Connections</MDBModalTitle>
                              <MDBBtn
                                className="btn-close"
                                color="none"
                                onClick={() =>
                                  setScrollableModal(!scrollableModal)
                                }
                              ></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                              {viewUserProfile.connected !== undefined &&
                              viewUserProfile.connected.length !== 0 ? (
                                <div>
                                  <h5>
                                    {viewUserProfile.connected.length}{" "}
                                    connections
                                  </h5>
                                  <hr className="mx-n3" />
                                  {viewUserProfile.connected.length !== 0 ? (
                                    viewUserProfile.connected.map(
                                      (connection) => (
                                        <>
                                         <div onClick={e => {nav(`/userProfile/${connection.UID}/`); setScrollableModal(!scrollableModal)}}>
                                          <Link style={{textDecoration:"none", color:"black", fontWeight:"bold"}} >{connection.name}</Link>
                                          </div>
                                        </>
                                      )
                                    )
                                  ) : (
                                    <></>
                                  )}
                                 
                                </div>
                              ) : (
                                <div>No connections.</div>
                              )}
                            </MDBModalBody>
                            <MDBModalFooter>
                              <MDBBtn onClick={() =>
                                  setScrollableModal(!scrollableModal)
                                }>Close</MDBBtn>
                            </MDBModalFooter>
                          </MDBModalContent>
                        </MDBModalDialog>
                      </MDBModal>
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
                    <MDBBtn
                      className="me-1"
                      color="success"
                      onClick={(e) => nav("/addProduct")}
                    >
                      Add New Product
                    </MDBBtn>

                    <MDBBtn
                      className="me-1"
                      color="warning"
                      onClick={(e) => nav("/addBlog")}
                    >
                      Add new Blog
                    </MDBBtn>

                    <MDBBtn color="info" onClick={(e) => nav("/addEvent")}>
                      Add new Event
                    </MDBBtn>

                    <MDBBtn className="me-1 ms-1" span color="danger">
                      My Orders
                    </MDBBtn>

                    <div className="d-flex justify-content-between align-items-center my-4">
                      <MDBCardText className="lead fw-normal mt-3">
                        <strong>My Blogs</strong>
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
                    {myProducts !== undefined && myProducts.length !== 0 ? (
                      <MDBContainer fluid className="my-5 text-center">
                        <h4>
                          {id === user.uid ? (
                            <div className="d-flex justify-content-between align-items-center">
                              <MDBCardText className="lead fw-normal mt-3">
                                <h4>
                                  <strong>My Products</strong>
                                </h4>
                              </MDBCardText>
                              <MDBCardText className="mb-0">
                                <a href="#!" className="text-muted">
                                  <h6>Show all</h6>
                                </a>
                              </MDBCardText>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-between align-items-center">
                              <MDBCardText className="lead fw-normal mt-3">
                                <h4>
                                  <strong>
                                    {viewUserProfile.name}'s Products
                                  </strong>
                                </h4>
                              </MDBCardText>
                              <MDBCardText className="mb-0">
                                <a href="#!" className="text-muted">
                                  <h6>Show all</h6>
                                </a>
                              </MDBCardText>
                            </div>
                          )}
                        </h4>

                        {/* /////////////////////////////////// */}
                        <MDBRow class="d-flex justify-content-center flex-wrap">
                          {myProducts.slice(0, 4).map((product) => (
                            <MDBCol
                              lg="6"
                              xl="6"
                              className="mb-1"
                              key={product.pid}
                            >
                              <MDBCard>
                                <MDBRipple
                                  className="bg-image"
                                  rippleTag="div"
                                  rippleColor="light"
                                >
                                  <img
                                    fluid
                                    src={
                                      product.MediaID !== undefined &&
                                      product.MediaID.length !== 0
                                        ? product.MediaID[0]
                                        : require("../default_image.webp")
                                    }
                                    style={{ width: "350px", height: "200px" }}
                                  />
                                  <a href="#!">
                                    <div
                                      className="mask"
                                      style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                                      }}
                                    >
                                      <div className="d-flex justify-content-center align-items-center h-100">
                                        <p className="text-white mb-0">
                                          <strong>{product.title}</strong>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{
                                          backgroundColor:
                                            "rgba(251, 251, 251, 0.2)",
                                        }}
                                      ></div>
                                    </div>
                                  </a>

                                  <Link to={`/viewProduct/${product.pid}`}>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{
                                          backgroundColor:
                                            "rgba(251, 251, 251, 0.15)",
                                        }}
                                      ></div>
                                    </div>
                                  </Link>
                                </MDBRipple>
                              </MDBCard>
                            </MDBCol>
                          ))}
                        </MDBRow>
                      </MDBContainer>
                    ) : (
                      <></>
                    )}

                    {user.uid === id &&
                    wishList !== undefined &&
                    wishList.length !== 0 ? (
                      <MDBContainer fluid className="my-5 text-center">
                        <div className="d-flex justify-content-between align-items-center">
                          <MDBCardText className="lead fw-normal mt-3">
                            <h4>
                              <strong>My WishList</strong>
                            </h4>
                          </MDBCardText>
                          <MDBCardText className="mb-0">
                            <a href="#!" className="text-muted">
                              <h6>Show all</h6>
                            </a>
                          </MDBCardText>
                        </div>

                        {/* /////////////////////////////////// */}
                        <MDBRow class="d-flex justify-content-center flex-wrap">
                          {wishList.slice(0, 4).map((product) => (
                            <MDBCol
                              lg="6"
                              xl="6"
                              className="mb-1"
                              key={product.pid}
                            >
                              <MDBCard>
                                <MDBRipple
                                  className="bg-image"
                                  rippleTag="div"
                                  rippleColor="light"
                                >
                                  <img
                                    fluid
                                    src={
                                      product.MediaID !== undefined &&
                                      product.MediaID.length !== 0
                                        ? product.MediaID[0]
                                        : require("../default_image.webp")
                                    }
                                    style={{ width: "320px", height: "200px" }}
                                  />
                                  <a href="#!">
                                    <div
                                      className="mask"
                                      style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                                      }}
                                    >
                                      <div className="d-flex justify-content-center align-items-center h-100">
                                        <p className="text-white mb-0">
                                          <strong>{product.title}</strong>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{
                                          backgroundColor:
                                            "rgba(251, 251, 251, 0.2)",
                                        }}
                                      ></div>
                                    </div>
                                  </a>

                                  <Link to={`/viewProduct/${product.pid}`}>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{
                                          backgroundColor:
                                            "rgba(251, 251, 251, 0.15)",
                                        }}
                                      ></div>
                                    </div>
                                  </Link>
                                </MDBRipple>
                              </MDBCard>
                            </MDBCol>
                          ))}
                        </MDBRow>
                      </MDBContainer>
                    ) : (
                      <></>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
