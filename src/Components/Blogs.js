import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import {db} from '../firebase-config';
import {collection , getDocs } from 'firebase/firestore';
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
export default function Blogs() {
  // const [blogs,setblogs] = useState([])
  // const blogCollectionRef = collection(db , "Blogs" )

  // useEffect(() => {
  //   const getblogs = async () => {
  //      const data = await getDocs(blogCollectionRef)
  //      console.log(data)
  //      setblogs(data.docs.map((doc) => ({...doc.data(), id:doc.id })))
  //   }

  //   getblogs();
  
  // },[])


  return (
    // <div >
    // <Row xs={1} md={2} className="g-4">
    //   {blogs.map(blog => (
    //     <Col>
    //       <Link to={`/viewBlog/${blog.id}`}
    //        style={{textDecoration: 'none',color:'black'}}>
    //       <Card key={blog.id} >
    //         <p  style={{alignContent:'center'}}><Card.Img variant="top" src={blog.image} style={{maxWidth: '100px', maxHeight: '100px'}} /></p>
           
    //         <Card.Body className='col-md-6 align-self-center'>
    //           <Card.Title>{blog.title}</Card.Title>
    //           <Card.Text>
    //             {blog.description}
    //           </Card.Text>
    //         </Card.Body>
    //       </Card>
    //       </Link>
          
    //     </Col>
    //   ))}
    // </Row>
    // </div>
    <>
   



    <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
      <MDBCol>
        <MDBCard className='h-100'>
          <MDBCardImage
            src='https://mdbootstrap.com/img/new/standard/city/044.webp'
            alt='...'
            position='top'
          />
          <MDBCardBody>
            <MDBCardTitle>Card title</MDBCardTitle>
            <MDBCardText>
              This is a longer card with supporting text below as a natural lead-in to additional content.
              This content is a little bit longer.
            </MDBCardText>
          </MDBCardBody>
          <MDBCardFooter>
            <small className='text-muted'>Last updated 3 mins ago</small>
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
      <MDBCol>
        <MDBCard className='h-100'>
          <MDBCardImage
            src='https://mdbootstrap.com/img/new/standard/city/043.webp'
            alt='...'
            position='top'
          />
          <MDBCardBody>
            <MDBCardTitle>Card title</MDBCardTitle>
            <MDBCardText>
              This card has supporting text below as a natural lead-in to additional content.
            </MDBCardText>
          </MDBCardBody>
          <MDBCardFooter>
            <small className='text-muted'>Last updated 3 mins ago</small>
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
      <MDBCol>
        <MDBCard className='h-100'>
          <MDBCardImage
            src='https://mdbootstrap.com/img/new/standard/city/042.webp'
            alt='...'
            position='top'
          />
          <MDBCardBody>
            <MDBCardTitle>Card title</MDBCardTitle>
            <MDBCardText>
              This is a wider card with supporting text below as a natural lead-in to additional content. This
              card has even longer content than the first to show that equal height action.
            </MDBCardText>
          </MDBCardBody>
          <MDBCardFooter>
            <small className='text-muted'>Last updated 3 mins ago</small>
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  
    </>
  )
}
