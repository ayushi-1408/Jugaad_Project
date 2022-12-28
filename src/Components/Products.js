import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc, Query } from "firebase/firestore";
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";
import { x } from "react-icons-kit/oct/x";

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
  MDBTooltip,
} from "mdb-react-ui-kit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Spinner from "./Spinner";
import ProductContext from "../Contexts/ProductsContext";
import { query, where } from "firebase/firestore";

export default function Products() {
  //const [products,setProducts] = useState()
  const productCollectionRef = collection(db, "Products");
  const { user, setUser } = useContext(UserContext);
  const { products, setProducts } = useContext(ProductContext);
  const [filteredProducts, setFilteredProducts] = useState();
  const auth = getAuth();

  const [suggestions, setSuggestion] = useState([
    // 'red shirt',
    // 'while pant',
    // 'uniform',
    // 'clothing'
  ]);

  useEffect(() => {
    if (products === undefined || filteredProducts === undefined) {
      const getProducts = async () => {
        const data = await getDocs(productCollectionRef);
        //console.log(data)
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setFilteredProducts(
          data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        //console.log(products)
      };

      getProducts();
      //console.log(products)
    }
  }, [products]);

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

  const [searchedItem, setSearchedItem] = useState("");

  const setSearch = (value) => {
    console.log(value);
    setSearchedItem(value);
    // suggestions.forEach(product => {
    //   console.log(product +" " +product.toLowerCase().includes(value.toLowerCase()))
    // });
    if (value !== "")
      setSuggestion(
        products
          .filter((element) =>
            element.title.toLowerCase().includes(value.toLowerCase())
          )
          .map((element) => element.title)
      );
    else setSuggestion([]);
    console.log(suggestions);
  };

  const findProducts = () => {
    setSuggestion();
    const keywordArray = searchedItem.toLowerCase().split(" ");
    console.log(keywordArray);

    const getData = () => {
      setFilteredProducts(
        products
          .map((product) => ({
            ...product,
            matchCount: findMatchCount(product.keywords, keywordArray),
          }))
          .filter((product) => product.matchCount !== 0)
          .sort((p1, p2) => p2.matchCount - p1.matchCount)
      );
    };
    if (searchedItem !== "") getData();
  };

  const findMatchCount = (keywords, words) => {
    let c = 0;
    if (keywords !== undefined)
      words.forEach((element) => {
        if (keywords.includes(element)) c++;
      });
    console.log(keywords + " " + c);
    return c;
  };

  const clearSearch = (e) => {
    setSearchedItem("");
    setSuggestion();
    setFilteredProducts(products.map((doc) => ({ ...doc })));
    console.log(products);
    console.log(filteredProducts);
  };

  return (
    <>
      {/* search bar */}

      <div>
        <div className=" md-5 d-flex justify-content-center mt-3 me-5 ">
          <div className="d-flex align-self-center">
            <div>
              <input
                className="form-control  hoverable "
                placeholder="Search"
                style={{ width: "300px" , border:"1px solid darkgray"}}
                type="text"
                aria-label="Search"
                value={searchedItem}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={e => {if(e.key=="Enter") findProducts()}}
              ></input>
              <div style={{borderRight: "1px solid darkgray", borderLeft: "1px solid darkgray"}}>
                {suggestions !== undefined && suggestions.length !== 0 ? (
                  suggestions.map((element) => {
                    return (
                      <>
                        <div
                          style={{ borderBottom: "1px solid darkgray", fontWeight:"bold"}}
                          onClick={(e) => {
                            setSearch(element);
                            findProducts();
                          }}
                        >
                          {element}
                        </div>
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            </div>

            {searchedItem !== undefined && searchedItem !== "" ? (
              <div className="m-2 d-flex align-self-start align-items-center">
                <div>
                  <Icon icon={x} onClick={(e) => clearSearch()} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {filteredProducts !== undefined && filteredProducts.length !== 0 ? (
        <MDBContainer
          fluid
          className="my-5 text-center"
          style={{ alignContent: "center" }}
        >
          <MDBRow style={{ alignSelf: "center" }}>
            {filteredProducts.map((product) => (
              <MDBCol
                className="my-2 col-md-4 col-lg-3 col-sm-12"
                key={product.id}
              >
                <Link
                  to={`/viewProduct/${product.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MDBCard style={{ maxWidth: "300px" }}>
                    <MDBRipple
                      rippleColor="light"
                      rippleTag="div"
                      className="bg-image rounded hover-zoom"
                    >
                      <MDBCardImage
                        src={
                          product.MediaID !== undefined &&
                          product.MediaID.length !== 0
                            ? product.MediaID[0]
                            : require("../default_image.webp")
                        }
                        fluid
                        className="w-100"
                        style={{ height: "250px" }}
                      />

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
                    </MDBRipple>
                    <MDBCardBody>
                      <h5 className="card-title mb-3">{product.title}</h5>

                      <h6 className="mb-3">${product.price}</h6>
                    </MDBCardBody>
                  </MDBCard>
                </Link>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
      ) : filteredProducts !== undefined && filteredProducts.length === 0 ? (
        <h5 className="mt-5">No products found.</h5>
      ) : (
        <Spinner />
      )}
    </>
  );
}
