import { useState } from "react";
import { Button, Col, Row} from 'antd';

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    designation: "",
    category: "",
    pointsFid: 0,
    tva: 0,
    prixTTC: 0,
    couleur: "#000000",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
/*mt-5 => haut, ml-5=>left , mr-5=>right, mb-5=>en bas*/ 
  return (
    < >
      <Row className="d-flex justify-content-center  ">
        <Col>
      <h2 className="p-6 border rounded shadow-lg">Ajouter un Article</h2>
      </Col>
      </Row>
    
      
        <Row className="d-flex justify-content-center  mt-3">
          <Col>
          <input 
            type="text" 
            name="designation" 
            placeholder="Désignation" 
            value={formData.designation} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
          </Col>
        </Row>
         
        <Row className="d-flex justify-content-center mt-2 ">
          <Col>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="cat1">Catégorie 1</option>
            <option value="cat2">Catégorie 2</option>
            <option value="cat3">Catégorie 3</option>
            <option value="cat4">Catégorie 4</option>
          </select>
          </Col>
        </Row>
       
        <Row className="d-flex justify-content-center mt-2 ">
     <Col>
          <input 
            type="number" 
            name="pointsFid" 
            placeholder="Nombre de points fidélité" 
            value={formData.pointsFid} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
          </Col>
        </Row>
       
        <Row className="d-flex justify-content-center mt-2 ">
        <Col>
          <input 
            type="number" 
            name="tva" 
            placeholder="TVA" 
            value={formData.tva} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
          </Col>
        </Row>
        
        <Row className="d-flex justify-content-center mt-2 ">
          <Col>
          <input 
            type="number" 
            name="prixTTC" 
            placeholder="Prix TTC" 
            value={formData.prixTTC} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
          </Col>
        </Row>
        
        <Row className="d-flex justify-content-center mt-2 ">
        <Col>
        <label htmlFor="couleur" className="block mb-2">Couleur</label>
        <input 
         type="color" 
         name="couleur" 
         value={formData.couleur} 
        onChange={handleChange} 
      className="w-full p-2 border rounded" 
          />
          </Col>
          </Row>

        
          <Row className="d-flex justify-content-center mt-2 ">
            <Col>
          <input 
      
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="w-full p-2 border rounded" 
          />
          </Col>
        </Row>
       
       <Row className="d-flex justify-content-center mt-2 "><Col>
        <Button type="primary" onClick={handleSubmit}>Ajouter</Button></Col> </Row>
             
    </>
  );
}
