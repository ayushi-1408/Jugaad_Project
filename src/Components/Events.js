import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import {db} from '../firebase-config';
import {collection , getDocs } from 'firebase/firestore';

export default function Events() {
  const [events,setEvents] = useState([])
  const eventCollectionRef = collection(db , "Events" )

  useEffect(() => {
    const getEvents = async () => {
       const data = await getDocs(eventCollectionRef)
       console.log(data)
       setEvents(data.docs.map((doc) => ({...doc.data(), id:doc.id })))
    }

    getEvents();
 
  },[])

  return (
    <div >
    <Row xs={1} md={2} className="g-4">
      {events.map(product => (
        <Col>
          <Link to={`/viewProduct/${product.id}`}
           style={{textDecoration: 'none',color:'black'}}>
          <Card key={product.id} >           
            <Card.Body className='col-md-6 align-self-center'>
              <Card.Title>{product.title}</Card.Title>
              <Card.Text>
                {product.description}
              </Card.Text>
              <Card.Text>
                {product.date}
              </Card.Text>
              <Card.Text>
                {product.location}
              </Card.Text>
            </Card.Body>
          </Card>
          </Link>
          
        </Col>
      ))}
    </Row>
    </div>
  )
}