import { Row, Col } from "antd";
import Produits from "./Produits";


const OutilPage = () => {

  return (
    <Row>
      <Col xs={24} sm={24} md={24}>
        <Produits />
      </Col>
    </Row>
  );
};

export default OutilPage;
