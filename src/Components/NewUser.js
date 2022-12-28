import { collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db } from "../firebase-config";
import { addDoc, getDocs, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
} from "mdb-react-ui-kit";

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
    image:undefined,
    dob: "",
    email: "",
    mobile: undefined,
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

  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newUser);

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        console.log(auth.currentUser);
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log(auth.currentUser);
            const userCollectionRef = doc(db, "Users", user.uid);
            const addUser = async () => {
              const ref = await setDoc(userCollectionRef, newUser);
              alert("Verify email");
              navigate("/login");
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
    // <div>
    //   <Form>
    //   <Form.Group className="mb-3" controlId="name">
    //     <Form.Label>Name</Form.Label>
    //     <Form.Control type="name" placeholder="name" onChange={handleInput} value={newUser.name} />
    //     <Form.Text className="text-muted">
    //       We'll never share your data with anyone else.
    //     </Form.Text>
    //   </Form.Group>

    //   <Form.Group className="mb-3" controlId="mobile">
    //     <Form.Label>Phone No.</Form.Label>
    //     <Form.Control type="number" placeholder="mobile" onChange={handleInput} value={newUser.mobile} />
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="email">
    //     <Form.Label>Email</Form.Label>
    //     <Form.Control type="email" placeholder="email" onChange={handleInput} value={newUser.email}/>
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="password">
    //     <Form.Label>Password</Form.Label>
    //     <Form.Control type="password" placeholder="password" onChange={handleInput} value={newUser.password}/>
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="dob">
    //     <Form.Label>Date of Birth</Form.Label>
    //     <Form.Control type="date" placeholder="dob" onChange={handleInput} value={newUser.dob}/>
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="address">
    //     <Form.Label>Address</Form.Label>
    //     <Form.Control type="text" placeholder="address" onChange={handleInput} value={newUser.address}/>
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="description">
    //     <Form.Label>Description</Form.Label>
    //     <Form.Control type="text" placeholder="description" onChange={handleInput} value={newUser.description} />
    //   </Form.Group>
    //   <Button variant="primary" type="submit" onClick={handleSubmit}>
    //     Submit
    //   </Button>
    // </Form>
    // </div>

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
              label="Dob"
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
            <div className="d-flex flex-row justify-content-center mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="I agree all statements in Terms of service"
              />
            </div>
            <MDBBtn className="mb-4 w-100 gradient-custom-4" size="lg" onClick={handleSubmit}>
              Register
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default NewUser;
