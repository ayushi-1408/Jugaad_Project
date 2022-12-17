import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

const Blog = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col
          md={{
            size: 12,
          }}
        >
          <Card className="mt-3 ps-2 border-0 shadow-sm">
            {
              <CardBody>
                <CardText> Posted By </CardText>

                <CardText>
                  <span className="text-muted"></span>
                </CardText>

                <div
                  className="divder"
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "#e2e2e2",
                  }}
                ></div>

                <CardText className="mt-3">
                  <h1>Title</h1>
                </CardText>
                <div
                  className="image-container  mt-4 shadow  "
                  style={{ maxWidth: "50%" }}
                >
                  {/* <img className="img-fluid" src={BASE_URL + '/post/image/' + post.imageName} alt="" /> */}
                </div>
                <CardText className="mt-5"></CardText>
              </CardBody>
            }
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col
          md={{
            size: 9,
            offset: 1,
          }}
        >
          <h3>Writ your Jugaad</h3>

          {
            <Card className="mt-4 border-0">
              <CardBody>
                <CardText>// Card text</CardText>
              </CardBody>
            </Card>
          }

          <Card className="mt-4 border-0">
            <CardBody>
              <Input type="textarea" placeholder="Enter your thoughts" />

              <Button onClick={onabort} className="mt-2" color="primary">
                Create Post
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostBlog;
