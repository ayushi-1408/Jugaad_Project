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
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBRipple,
} from "mdb-react-ui-kit";

export default function Products() {
  // const [products,setProducts] = useState([])
  // const productCollectionRef = collection(db , "Products" )

  // useEffect(() => {
  //   const getProducts = async () => {
  //      const data = await getDocs(productCollectionRef)
  //      console.log(data)
  //      setProducts(data.docs.map((doc) => ({...doc.data(), id:doc.id })))
  //   }

  //   getProducts();
  //   // axios.get('https://fakestoreapi.com/products')
  //   // .then( res => {
  //   //   console.log(res)
  //   //   setProducts(res.data)
  //   // })
  //   // .catch(err => {
  //   //   console.log(err)

  //   // })
  // },[])

  return (
    // <div >
    // <Row xs={1} md={2} className="g-4">
    //   {products.map(product => (
    //     <Col>
    //       <Link to={`/viewProduct/${product.id}`}
    //        style={{textDecoration: 'none',color:'black'}}>
    //       <Card key={product.id} >
    //         <p  style={{alignContent:'center'}}><Card.Img variant="top" src={product.image} style={{maxWidth: '100px', maxHeight: '100px'}} /></p>
           
    //         <Card.Body className='col-md-6 align-self-center'>
    //           <Card.Title>{product.title}</Card.Title>
    //           <Card.Text>
    //             {product.description}
    //           </Card.Text>
    //         </Card.Body>
    //       </Card>
    //       </Link>
          
    //     </Col>
    //   ))}
    // </Row>
    // </div>
    <>
   
    <MDBContainer fluid className="my-5 text-center">
      <h4 className="mt-4 mb-5">
        <strong>Our Products</strong>
      </h4>

      <MDBRow>
        <MDBCol md="12" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/belt.webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div className="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge bg-primary ms-2">New</span>
                    </h5>
                  </div>
                </div>
                <div className="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div className="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge bg-success ms-2">Eco</span>
                    </h5>
                  </div>
                </div>
                <div className="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/shoes%20(3).webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div className="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge bg-danger ms-2">-10%</span>
                    </h5>
                  </div>
                </div>
                <div class="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">
                <s>$61.99</s>
                <strong className="ms-2 text-danger">$50.99</strong>
              </h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="12" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(23).webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div className="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge bg-success ms-2">Eco</span>
                      <span className="badge bg-danger ms-2">-10%</span>
                    </h5>
                  </div>
                </div>
                <div className="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">
                <s>$61.99</s>
                <strong className="ms-2 text-danger">$50.99</strong>
              </h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(17).webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div class="d-flex justify-content-start align-items-end h-100"></div>
                </div>
                <div className="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="4" className="mb-4">
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(30).webp"
                fluid
                className="w-100"
              />
              <a href="#!">
                <div className="mask">
                  <div class="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge bg-primary ms-2">New</span>
                      <span className="badge bg-success ms-2">Eco</span>
                      <span className="badge bg-danger ms-2">-10%</span>
                    </h5>
                  </div>
                </div>
                <div className="hover-overlay">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <a href="#!" className="text-reset">
                <h5 className="card-title mb-3">Product name</h5>
              </a>
              <a href="#!" className="text-reset">
                <p>Category</p>
              </a>
              <h6 className="mb-3">
                <s>$61.99</s>
                <strong className="ms-2 text-danger">$50.99</strong>
              </h6>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

</>
  )
}
