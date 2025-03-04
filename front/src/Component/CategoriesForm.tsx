import { useState } from "react";
import { Button, Col, Row} from 'antd';

export default function CategoriesForm() {
  const [formCategory, setformCategory] = useState({
    designation: "",
    couleur: "#000000",
    image: null as File | null,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setformCategory({
      ...formCategory,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setformCategory({ ...formCategory, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formCategory);
  };
/*mt-5 => haut, ml-5=>left , mr-5=>right, mb-5=>en bas*/ 
  return (
    < >
      <Row className="d-flex justify-content-center  ">
        <Col>
      <h2 className="p-6 border rounded shadow-lg">Ajouter une categorie</h2>
      </Col>
      </Row>
    
      
        <Row className="d-flex justify-content-center  mt-3">
          <Col>
          <input 
            type="text" 
            name="designation" 
            placeholder="Désignation" 
            value={formCategory.designation} 
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
         value={formCategory.couleur} 
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





  