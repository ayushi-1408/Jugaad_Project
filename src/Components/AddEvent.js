import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {db} from '../firebase-config';
import {addDoc, arrayUnion, collection , doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import UserContext from '../Contexts/UserContext';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EventsContext from '../Contexts/EventsContext';
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
import Select from "react-select";
import { Country, State, City }  from 'country-state-city';

function AddEvent() {
    const [newEvent,setNewEvent] = useState({
      title:"",
      dateOfPosting:new Date(),
      dateOfEvent:new Date(),
      description:"",
      address:"",
      categories:[],
    })
    const eventCollectionRef = collection(db , "Events" )

    const {user,setUser}= useContext(UserContext)
    const {events, setEvents} = useContext(EventsContext)


    const auth=getAuth()

    const nav=useNavigate()

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
        const name=e.target.name;
        const value=e.target.value;

        setNewEvent({...newEvent, [name]:value})
        //console.log(newEvent)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(newEvent)
        setNewEvent({...newEvent, UID:user.uid})
        //console.log(user.uid)
        const addEvent = async () => {
            const ref1 = await addDoc(eventCollectionRef,newEvent)
            console.log(ref1.id)
            const userRef = doc(db, "Users", user.uid)  
            await updateDoc(userRef,{
            EID:arrayUnion(ref1.id)
            })
            console.log("updated user")
            setEvents();
            setUser();
            setNewEvent({
              title:"",
              dateOfPosting:new Date(),
              dateOfEvent:new Date(),
              description:"",
              address:"",
              categories:[],
            });
         }
     
         addEvent();

    }

    // const countries = Country.getAllCountries();

    // const updatedCountries = countries.map((country) => ({
    //   label: country.name,
    //   value: country.id,
    //   ...country
    // }));
    // const updatedStates = (countryId) =>
    //   State
    //     .getStatesOfCountry(countryId)
    //     .map((state) => ({ label: state.name, value: state.id, ...state }));

    // const updatedCities = (countryId,stateId) =>
    //   City
    //     .getCitiesOfState(countryId,stateId)
    //     .map((city) => ({ label: city.name, value: city.id, ...city }));

     

  return (
    <div className="py-2  bg-success m-0">
      <MDBContainer >
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="9" xl="7">
                <h3>ADD AN EVENT</h3>
                <MDBCard className="mt-4 border-0  mb-4">
                  <MDBCardBody>
      <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="name" name="title" onChange={handleInput} value={newEvent.title} />
        <Form.Text className="text-muted">
          We'll never share your data with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" onChange={handleInput} value={newEvent.description} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" name="dateOfEvent" onChange={handleInput} value={newEvent.date}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" namer="address" onChange={handleInput} value={newEvent.location}/>
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="city">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" name="city" onChange={handleInput} value={newEvent.location}/>
      </Form.Group> */}
      {/* <Select
          id="country"
          name="country"
          label="country"
          options={updatedCountries}
          value={newEvent.country}
          onChange={(val) => {setNewEvent({...newEvent, country:val}); console.log(val)}}
        />
        <Select
          id="state"
          name="state"
          options={updatedStates(newEvent.country ? newEvent.country.isoCode : null)}
          value={newEvent.state}
          onChange={(val) => {setNewEvent({...newEvent, state:val}); console.log(val)}}
        />
        <Select
          id="city"
          name="city"
          options={updatedCities(newEvent.state ? newEvent.state.countryCode : null, newEvent.country ? newEvent.country.isoCode : null)}
          value={newEvent.city}
          onChange={(val) => {setNewEvent({...newEvent, city:val}); console.log(val)}}
        /> */}
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
    </MDBCardBody>
    </MDBCard>
    </MDBCol>
    </MDBRow>
    </MDBContainer>
    
    </div>
  )
}

export default AddEvent