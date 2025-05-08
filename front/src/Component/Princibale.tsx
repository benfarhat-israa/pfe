import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const VideoDemo = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={<Title level={4}>🎥 Présentation du Système de Caisse</Title>}
        bordered={false}
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        <video
          width="100%"
          controls
          autoPlay
          loop
          muted
          style={{ borderRadius: "8px" }}
        >
          <source src="vd.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>


      </Card>
    </div>
  );
};

export default VideoDemo;
