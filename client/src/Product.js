import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function Product() {
  const [product, setProduct] = useState();
  const {id} = useParams();

  useEffect(() => {
    axios.get("http://localhost:9000/getProductInfo?id=" + id).then(res => {
      if(res.status === 200) {
        setProduct(res.data[0]);
      }
    })
  }, [id]);


    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {product && 
          <div className="card" style={{ width: '22rem', margin: '15px' }}>
            <div className="card-body">
              <h5 className="card-title">{product.MANUFACTURER_NAME} - {product.NAME}</h5>
              <p className="card-text"></p>
            </div>
            <div className="card-footer">
              <small className="text-muted">${product.PRICE}</small>
            </div>
            <a href={"/product/purchase/id="+id} className="btn btn-primary" style={{margin: '15px' }}>Purchase</a>
          </div>
        }
      </div>
      );
    }
export default Product;