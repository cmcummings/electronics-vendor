import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // API request for products list
    const search = searchParams.get("s");
    let query = "http://localhost:9000/products"
    if (search) {
      query += "?s=" + search
    }
    axios.get(query).then(res => {
      setProducts(res.data);
      console.log(res.data);
    });
  }, [searchParams]);


  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <div className="card-deck">
      {products.map(item => {
        return(<div key={item.PRODUCT_ID} className="card" style={{ width: '22rem', margin: '15px' }}>
        <div className="card-body">
          <h5 className="card-title">{item.MANUFACTURER_NAME} - {item.NAME}</h5>
          <p className="card-text">{item.TYPE}</p>
          <a href={"/product/"+item.PRODUCT_ID} className="card-link">Product Page</a>
        </div>
        <div className="card-footer">
          <small className="text-muted">${item.PRICE}</small>
        </div>
        <a href={"/product/purchase/"+item.PRODUCT_ID} className="btn btn-primary" style={{margin: '15px' }}>Purchase</a>
      </div>)
      })}
    </div>
    </div>
    );
  }
    
export default AllProducts;