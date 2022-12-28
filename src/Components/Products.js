import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc, Query } from "firebase/firestore";
import { Icon } from 'react-icons-kit'
import {search} from 'react-icons-kit/icomoon/search'
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

  const [suggestions, setSuggestion ] = useState([
    // 'red shirt',
    // 'while pant',
    // 'uniform',
    // 'clothing'
  ])

  useEffect(() => {
    if (products === undefined || filteredProducts === undefined) {
      const getProducts = async () => {
        const data = await getDocs(productCollectionRef);
        //console.log(data)
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setFilteredProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
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
    if(value !== "" ) setSuggestion(products.filter((element) => element.title.toLowerCase().includes(value.toLowerCase())).map((element) => (element.title)))
    else setSuggestion([])
    console.log(suggestions)
  }

  const findProducts = () => {
    setSuggestion()
    const keywordArray = searchedItem.toLowerCase().split(" ");
    console.log(keywordArray)
    // const getData = async () => {
    //   const q = query(productCollectionRef, 
    //     where('keywords', 'array-contains-any', keywordArray));
    //     const data = await getDocs(q);
    //     setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        
    // }
    const getData = () => {
      setFilteredProducts(products.map((product) => ({...product, matchCount: findMatchCount(product.keywords,keywordArray)})).filter((product) => product.matchCount !== 0).sort((p1,p2) => p2.matchCount - p1.matchCount))
    }
    if(searchedItem !== "") getData();
    
    
  }

  const findMatchCount = (keywords, words) => {
    let c=0;
    if(keywords !== undefined) words.forEach(element => {
      if(keywords.includes(element)) c++;
    });
    console.log(keywords+" "+c)
    return c;
  }

  const clearSearch = (e) => {
    setFilteredProducts(products.map((doc) => ({ ...doc })));
    console.log(products)
    console.log(filteredProducts)
  }

  return (
    <>

    {/* search bar */}
    <MDBRow>
    <MDBCol md="6">
      <input className="form-control" type="text" placeholder="Search" aria-label="Search" value={searchedItem} onChange={e => setSearch(e.target.value)} />
      <Icon icon={search} onClick={findProducts} />
      <Button onClick={clearSearch}>Clear search</Button>
    </MDBCol>
    </MDBRow>
    <MDBRow>
    <MDBCol>
      {
        suggestions !== undefined && suggestions.length !== 0 ? (
          suggestions
          .map((element) => {
            return (
              <div onClick={ e => setSearch(element)}>{element}</div>
            )
          })
        ) :(
          <></>
        )
      }
    </MDBCol>
    </MDBRow>


    
      {filteredProducts !== undefined && filteredProducts.length !== 0 ? (
        <MDBContainer fluid className="my-5 text-center" style={{alignContent:"center"}}>
          <h3 className="mt-4 mb-5">
            <strong>Our Products</strong>
          </h3>

          <MDBRow style={{alignSelf:"center"}}>
            {filteredProducts.map((product) => (
              <MDBCol className="my-2 col-md-4 col-lg-3 col-sm-12" key={product.id} >
                <Link to={`/viewProduct/${product.id}`} style={{textDecoration:"none", color:"black"}}>
                <MDBCard style={{maxWidth:"300px"}}>
                  <MDBRipple
                    rippleColor="light"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom"
                  >
                    <MDBCardImage src={product.MediaID !== undefined && product.MediaID.length !== 0 ? product.MediaID[0] : require('../default_image.webp')} 
                    fluid className="w-100"  style={{height:"250px", }}
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
      ) : (
        <Spinner />
      )}
    </>
  );
}
