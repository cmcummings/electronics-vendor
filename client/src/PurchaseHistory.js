import { useState, useEffect } from "react";
import axios from 'axios';

function PurchaseHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:9000/purchaseHistory?email=' + localStorage.getItem('email')).then(res => {
        setHistory(res.data);
      }).catch(err => {
        throw(err);
      });
    }, []);

    return (
      <div className="mt-3 container-md w-50 p-3 border bg-light">
        <h2>Purchase History</h2>
        <p>Purchase history of {localStorage.getItem("email")}</p>
        <div className="mt-3 border container-md">
          {history.map(item => {
            const time = item.TIME.split("T")[0]
            return (
              <div key={item.NAME} className="my-2 border-bottom">
                <b><a href={"/product/" + item.PRODUCT_ID}>{item.NAME}</a></b> 
                <br></br> 
                Purchased on {time}
                <br></br>
                <br></br>
                {item.TRACKING_NUMBER && 
                  <p>
                    This item is being shipped.
                    <br></br>
                    Tracking Number: {item.TRACKING_NUMBER}
                    <br></br>
                    Status: {item.STATUS}
                  </p>
                }
                
              </div>
            )
          })}
        </div>
      </div>
    );
  }
  
export default PurchaseHistory;