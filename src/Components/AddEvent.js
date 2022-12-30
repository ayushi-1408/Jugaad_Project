import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db } from "../firebase-config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { Link, redirect, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EventsContext from "../Contexts/EventsContext";
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
import { cities } from "indian-cities-json";
import Select from "react-select";
import ReactSelect from "react-select";
import { AlignCenter } from "react-bootstrap-icons";
import Spinner from "./Spinner";

function AddEvent() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    dateOfPosting: new Date(),
    dateOfEvent: "",
    description: "",
    address: "",
    categories: [],
    city: {
      label: "",
      name: "",
    },
    timeOfEvent: "",
  });
  const eventCollectionRef = collection(db, "Events");

  const { user, setUser } = useContext(UserContext);
  const { events, setEvents } = useContext(EventsContext);

  const [spinner, setSpinner] = useState(false);

  const auth = getAuth();

  const nav = useNavigate();

  if (user == undefined || user.uid == undefined) {
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
        // console.log(userr);
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

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSpinner(true);
    console.log(newEvent);
    //console.log(user.uid)
    const addEvent = async () => {
      const ref1 = await addDoc(eventCollectionRef, newEvent);
      await updateDoc(ref1, {
        UID:user.uid
      })
      console.log(ref1.id);
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        EID: arrayUnion(ref1.id),
      });
      console.log("updated user");
      setEvents();
      setUser();
      setNewEvent({
        title: "",
        dateOfPosting: new Date(),
        dateOfEvent: "",
        description: "",
        address: "",
        categories: [],
        city: {
          label: "",
          name: "",
        },
        timeOfEvent: "",
      });
      setSpinner(false);
      alert("Event added");
    };
    addEvent();
  };

  const getCities = () => {
    return cities.map((doc) => ({ label: doc.name, name: doc.name }));
  };

  return (
    <div className="py-2  bg-success m-0">
      <MDBContainer>
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="5">
            <h3>ADD AN EVENT</h3>
            <MDBCard className="mt-4 border-0  mb-4">
              <MDBCardBody className=" d-flex justify-content-center">
                <Form style={{ maxWidth: "300px" }}>
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="name"
                      name="title"
                      onChange={handleInput}
                      value={newEvent.title}
                    />
                    <Form.Text className="text-muted">
                      We'll never share your data with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      onChange={handleInput}
                      value={newEvent.description}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="date">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfEvent"
                      onChange={handleInput}
                      value={newEvent.dateOfEvent}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="date">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="timeOfEvent"
                      onChange={handleInput}
                      value={newEvent.timeOfEvent}
                      className="d-flex align-self-center justify-self-center"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      onChange={handleInput}
                      value={newEvent.address}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <ReactSelect
                      id="city"
                      name="city"
                      options={getCities()}
                      value={newEvent.city}
                      onChange={(val) =>
                        setNewEvent({ ...newEvent, city: val })
                      }
                    />
                  </Form.Group>

                  {spinner ? (
                    <Spinner />
                  ) : (
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                      className="my-2"
                    >
                      Submit
                    </Button>
                  )}
                </Form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default AddEvent;
