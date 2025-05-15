import React from "react";
import Row from "react-bootstrap/esm/Row";
import classes from "./Content.module.css";
import { Col } from "react-bootstrap";
import Image from "./Image";
const Content = (props: any) => {
  return (
    <Row className={classes.container}>
      <Col>
        <div className={classes.content_container}>{props.children}</div>
      </Col>
      {props.hasImage && (
        <Col className={classes.secondcol}>
          <Image />
        </Col>
      )}
    </Row>
  );
};
export default Content;
