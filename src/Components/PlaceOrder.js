import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  arrayRemove,
} from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Form } from "react-bootstrap";

function PlaceOrder(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [product, setProduct] = useState([]);

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const productCollectionRef = doc(db, "Products", id);

  const nav = useNavigate();

  if (!user) {
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
        console.log(userr);
        setUser(userr.uid);
      } else {
        console.log("not signed");
        nav("/login");
      }
    });
  }

  console.log(user);

  useEffect(() => {
    const getProduct = async () => {
      const data = await getDoc(productCollectionRef);
      console.log(data.data());
      setProduct(data.data());
    };

    getProduct();
  }, [!user]);

  const [order, setOrder] = useState({
    quantity: 1,
    PID: id,
    mode_of_payment: "online",
  });

  const handleInput = (e) => {
    const name = e.target.placeholder;
    const value = e.target.value;

    setOrder({ ...order, [name]: value });
  };

  const handleOrder = (e) => {
    e.preventDefault()
    const orderRef = collection(db, "Orders");
    const addOrder = async () => {
      setOrder({ ...order, UID: user });
      const ref1 = await addDoc(orderRef, order);
      console.log(ref1.id);
      const userRef = doc(db, "Users", user);
      await updateDoc(userRef, {
        OID: arrayUnion(ref1.id),
      });
      console.log("updated user");
      await updateDoc(userRef, {
        Cart: arrayRemove(ref1.id),
      });
      alert("Order placed")
      nav('/cart')
    };
    addOrder();
  };

  return (
    <div>
      <Card>
        <p style={{ alignContent: "center" }}>
          <Card.Img
            variant="top"
            src={product.image}
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        </p>
        <Card.Body>
          <Card.Text>{product.title}</Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <Card.Text>Total amount - P{product.price}</Card.Text>
        </Card.Body>
      </Card>
      <Form>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Enter Shipping Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="address"
            onClick={handleInput}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleOrder}>
          Place Order
        </Button>
      </Form>
    </div>
  );
}

export default PlaceOrder;
