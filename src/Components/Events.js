import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "./Spinner";
import EventsContext from "../Contexts/EventsContext";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Form } from "react-bootstrap";
import ReactSelect from "react-select";
import { cities } from "indian-cities-json";
import { search } from "react-icons-kit/icomoon/search";
import Icon from "react-icons-kit";
import { x } from "react-icons-kit/oct/x";

export default function Events() {
  const { events, setEvents } = useContext(EventsContext);
  const eventCollectionRef = collection(db, "Events");
  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [filteredEvents, setfilteredEvents] = useState();

  const [searchedCity, setSearchedCity] = useState({
    name:"",
    label:"Search City..."
  });

  useEffect(() => {
    if (events === undefined) {
      const getEvents = async () => {
        const data = await getDocs(eventCollectionRef);
        ///console.log(data)
        setEvents(
          data.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .sort(
              (e1, e2) =>
                new Date(e1.dateOfEvent).getTime() -
                new Date(e2.dateOfEvent).getTime()
            )
        );
        setfilteredEvents(data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort(
            (e1, e2) =>
              new Date(e1.dateOfEvent).getTime() -
              new Date(e2.dateOfEvent).getTime()
          ))
      };

      getEvents();
    }
    else if(filteredEvents === undefined) {
      setfilteredEvents(events.map((doc) => ({...doc})))
    }
  }, [events]);

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
      }
    });
  }

  const getCities = () => {
    return cities.map((doc) => ({ label: doc.name, name: doc.name }));
  };

  const findEvents = () => {
    setfilteredEvents(
      events.map((doc) => ({...doc})).filter((doc) => doc.city.name === searchedCity.name)
    );
  }

  const resetEvents = () => {
    setfilteredEvents(events.map((doc) => ({...doc})))
    setSearchedCity({
      name:"",
      label:"Search City..."
    });
  }


  return (
    <div className="gradient-custom">
     
        <div >
          <div className="d-flex justify-content-center ">
          <Form.Group
            className="py-3 ps-3 pe-1"
            controlId="city"
            style={{ width: "300px" }}
          >
            <ReactSelect
              id="city"
              name="city"
              options={getCities()}
              value={searchedCity}
              onChange={(val) =>
                setSearchedCity(val)
              }
              
            />
          </Form.Group>
          <Button className="my-3 btn-light" onClick={findEvents}>
          <Icon icon={search} className="d-flex align-self-center " style={{size:"1.9rem" }} />
          </Button>
          <Button className="my-3 ms-1 btn-light" onClick={resetEvents}>
          <Icon icon={x} className="d-flex align-self-center " style={{size:"1.9rem" }} />
          </Button>
          </div>
          </div>
          {filteredEvents !== undefined ? (
          <MDBRow className=" row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5  d-flex justify-content-center g-4 p-3">
            {
              filteredEvents.length !== 0 ? (
                filteredEvents.map((product) => (
                  <MDBCol key={product.id}>
                    <Link
                      to={`/viewEvent/${product.id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MDBCard>
                        {product.city !== undefined ? (
                          <MDBCardHeader>{product.city.name}</MDBCardHeader>
                        ) : (
                          <></>
                        )}
                        <MDBCardBody>
                          <MDBCardTitle>{product.title}</MDBCardTitle>
                        </MDBCardBody>
                        <MDBCardFooter className="text-muted">
                          <div>{new Date(product.dateOfEvent).toDateString()}</div>
                        </MDBCardFooter>
                      </MDBCard>
                    </Link>
                  </MDBCol>
                ))
              ) : (
                <h5>No Events Found. </h5>
              ) 
            }
            
          </MDBRow>
        
      ) : (
        <Spinner />
      )}
    </div>
  );
}
