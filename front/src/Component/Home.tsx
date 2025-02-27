import { Col, Row } from "antd";
import React from "react";

const App: React.FC = () => {
  return (
    <Row>
 <Col span={18} push={6}>
      Col
    </Col>
    <Col span={18} push={6}>
      Col
    </Col>
    <Col span={18} push={6}>
      Col
    </Col>
    </Row>
  );
};

export default App;
