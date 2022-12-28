import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db, storage } from "../firebase-config";
import { addDoc, getDocs, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBFile,
} from "mdb-react-ui-kit";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import  Spinner  from "./Spinner";

function NewUser() {
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    description: "",
    dateOfPosting: new Date(),
    address: "",
    connected: [],
    requestsReceived: [],
    requestsMade: [],
    image: "",
    email: "",
    OID: [],
    BID: [],
    Cart: [],
    PID: [],
    EID: [],
    WishPID: [],
    SavedBID: [],
    SavedEID: [],
    additionalInfo: {},
  });

  const [media, setMedia] = useState();

  const[spinner,setSpinner] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "image") setMedia(e.target.files[0]);
    else setNewUser({ ...newUser, [name]: value });
  };

  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newUser);
    setSpinner(true);
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        signOut(auth).then(() => {
          console.log(auth.currentUser);
        });

        sendEmailVerification(auth.currentUser)
          .then(() => {
            const addUser = async () => {
              const data = await setDoc(doc(db, "Users", user.uid), newUser);
              const imageRef = ref(storage, `images/${user.uid}`);
              await uploadBytes(imageRef, media).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  console.log(url);
                  updateDoc(doc(db, "Users", user.uid), {
                    image: url,
                  });
                });
              });
              setNewUser({
                name: "",
                password: "",
                description: "",
                dateOfPosting: new Date(),
                address: "",
                connected: [],
                requestsReceived: [],
                requestsMade: [],
                image: "",
                email: "",
                OID: [],
                BID: [],
                Cart: [],
                PID: [],
                EID: [],
                WishPID: [],
                SavedBID: [],
                SavedEID: [],
                additionalInfo: {},
              });
              setSpinner(false);
              alert("Verify email to Login");
              navigate('/login');
              console.log(auth.currentUser);
            };

            addUser();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <>
      <MDBContainer
        fluid
        className="d-flex align-items-center justify-content-center bg-image"
        style={{
          backgroundImage:
            "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)",
        }}
      >
        <div className="mask gradient-custom-3"></div>
        <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
          <MDBCardBody className="px-5">
            <h2 className="text-uppercase text-center mb-5">
              Create an account
            </h2>
            <MDBInput
              wrapperClass="mb-4"
              label="Your Name"
              size="lg"
              id="form1"
              type="text"
              name="name"
              onChange={handleInput}
              value={newUser.name}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Your Email"
              size="lg"
              id="form2"
              type="email"
              name="email"
              onChange={handleInput}
              value={newUser.email}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              size="lg"
              id="form3"
              type="password"
              name="password"
              onChange={handleInput}
              value={newUser.password}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Mobile No."
              size="lg"
              id="form4"
              type="phone"
              name="mobile"
              onChange={handleInput}
              value={newUser.mobile}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Date of Birth"
              size="lg"
              id="form5"
              type="date"
              name="dob"
              onChange={handleInput}
              value={newUser.dob}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Address"
              size="lg"
              id="form6"
              type="text"
              name="address"
              onChange={handleInput}
              value={newUser.address}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Description"
              size="lg"
              id="form7"
              type="textarea"
              name="description"
              onChange={handleInput}
              value={newUser.description}
            />
            <MDBFile
              size="md"
              placeholder="Profile Picture"
              onChange={handleInput}
              id="customFile"
              label="Profile Picture"
              name="image"
            />
            <div className="d-flex flex-row justify-content-center mb-4">
              {/* <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="I agree all statements in Terms of service"
              /> */}
            </div>
            {
              spinner ? (
                <Spinner/>
              ) : (
                <MDBBtn
                className="mb-4 w-100 gradient-custom-4"
                size="lg"
                onClick={handleSubmit}
              >
                Register
              </MDBBtn>
              )
            }
           
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default NewUser;
