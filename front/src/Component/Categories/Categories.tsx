import React, { useState } from "react";
import { Button, Row, Col } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

const categories: string[] = [
  "CHOISIS TA BASE",
  "TOPPING",
  "SAUCES",
  "SARRASIN",
  "CRUNCH",
  "BOISSONS",
  "LÉGUMES FRUITS",
  "SUPPLÉMENTS",
  "DESSERTS",
];

const CategorySelection: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="container mt-4">
      <Row gutter={[16, 16]} justify="center">
        {categories.map((category, index) => (
          <Col xs={12} sm={8} md={6} key={index}>
            <Button
              block
              className={`custom-btn ${selected === index ? "selected" : ""}`}
              onClick={() => setSelected(index)}
            >
              {category}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySelection;
