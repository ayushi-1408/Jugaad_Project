import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Spinner from "./Spinner";
import ProductContext from "../Contexts/ProductsContext";

export default function Products() {
  //const [products,setProducts] = useState()
  const productCollectionRef = collection(db, "Products");
  const { user, setUser } = useContext(UserContext);
  const { products, setProducts } = useContext(ProductContext);
  const auth = getAuth();

  useEffect(() => {
    if (products === undefined) {
      const getProducts = async () => {
        const data = await getDocs(productCollectionRef);
        //console.log(data)
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        //console.log(products)
      };

      getProducts();
      //console.log(products)
    }
  }, [!products]);

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

  return (
    <>
      {products !== undefined ? (
        <MDBContainer fluid className="my-5 text-center">
          <h4 className="mt-4 mb-5">
            <strong>Our Products</strong>
          </h4>

          <MDBRow>
            {products.map((product) => (
              <MDBCol md="12" lg="4" className="mb-4" key={product.id}>
                <MDBCard>
                  <MDBRipple
                    rippleColor="light"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom"
                  >
                    <MDBCardImage src={product.image} fluid className="w-100" />
                    <Link to={`/viewProduct/${product.id}`} >
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
                          style={{
                            backgroundColor: "rgba(251, 251, 251, 0.15)",
                          }}
                        ></div>
                      </div>
                    </Link>
                  </MDBRipple>
                  <MDBCardBody>
                    <Link
                      to={`/viewProduct/${product.id}`}
                      className="text-reset"
                      
                    >
                      <h5 className="card-title mb-3">{product.title}</h5>
                    </Link>
                    <Link
                      to={`/viewProduct/${product.id}`}
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
        <Spinner />
      )}
    </>
  );
}
