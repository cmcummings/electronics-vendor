import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function ProductPurchase() {
  const [userInfo, setUserInfo] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [formEmail, setFormEmail] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [cardNum, setCardNum] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [CVV, setCVV] = useState("");
  const [purchaseMethod, setPurchaseMethod] = useState("");

  const [success, setSuccess] = useState(false);
  const [contract, setContract] = useState();
  const [contractExists, setContractExists] = useState();
  const {id} = useParams()

  const [searchParams] = useSearchParams();
  searchParams.get("id")

  var productID = String(id)
  productID = productID.substring(productID.indexOf("=") + 1);
  
  function requestUpdatePurchase(e) {
    console.log("Purchase attempted")
    e.preventDefault();
    
    let addr = "http://localhost:9000/purchaseItem?email=" + localStorage.getItem("email") + "&id=" + id;
    console.log(addr);

    axios.get(addr).then(res => {
    if(res.status === 200) {
      setSuccess(true);
    } else {
      setErrorMsg("Update failed.");
    }
    });
  }

  function requestUpdateUserData(e) {
    e.preventDefault();
    
    let send = false; // if changes actually need to be made
    let addr = "http://localhost:9000/updateCustomerInfo?email=" + localStorage.getItem("email");

    if(firstName !== userInfo.firstName) {
      addr += "&first_name=" + firstName;
      send = true;
    }

    if(lastName !== userInfo.lastName) {
      addr += "&last_name=" + lastName;
      send = true;
    } 

    if(street !== userInfo.street) {
      addr += "&street=" + street;
      send = true;
    }

    if(city !== userInfo.city) {
      addr += "&city=" + city;
      send = true;
    }

    if(state !== userInfo.state) {
      addr += "&state=" + state;
      send = true;
    }

    if(zipCode !== userInfo.zipCode) {
      addr += "&zip_code=" + zipCode;
      send = true;
    }

    if(zipCode !== userInfo.zipCode) {
      addr += "&zip_code=" + zipCode;
      send = true;
    }

    if(cardNum !== userInfo.cardNum) {
      addr += "&card_num=" + cardNum;
      send = true;
    }

    if(send) {
      axios.get(addr).then(res => {
        if(res.status === 200) {
          setErrorMsg(null);
          setSuccess(true);
          setUserInfo({
            firstName: firstName,
            lastName: lastName,
            street: street,
            city: city,
            state: state,
            zipCode: zipCode,
            cardNum: cardNum
          });
        } else {
          setErrorMsg("Update failed.");
        }
      });
    }
  }

  
  function requestUpdate(e) {
    e.preventDefault();
    console.log("purchase method:" + purchaseMethod);
    if(purchaseMethod === "contract"){
      console.log("contract chosen");
      if(firstName === ""
        || lastName === ""
        || street === ""
        || city === ""
        || state === ""
        || zipCode === ""
        ) {
          setSuccess(false);
          setErrorMsg("Please fill in all fields.");
      }else{
        requestUpdateUserData(e);
        requestUpdatePurchase(e);
        setSuccess(true);
      }
    }else{
      if(firstName === ""
        || lastName === ""
        || street === ""
        || city === ""
        || state === ""
        || zipCode === ""
        || cardNum === ""
        || cardZip === ""
        || CVV === "") {
          setSuccess(false);
          setErrorMsg("Please fill in all fields.");
      }else{
        requestUpdateUserData(e);
        requestUpdatePurchase(e);
      }
    }
  }

  useEffect(() => {
    setPurchaseMethod("card");
    if (userInfo.length === 0) {
      // API request to get info
      axios.get("http://localhost:9000/getCustomerInfo?email=" + localStorage.getItem("email")).then(res => {
        const info = res.data[0];
        if(info) {
          setUserInfo({
            firstName: info.FIRST_NAME || "",
            lastName: info.LAST_NAME || "",
            street: info.STREET || "",
            city: info.CITY || "",
            state: info.STATE || "",
            zipCode: info.ZIP_CODE || "",
            cardNum: info.CARD_NUM || ""
          });
        } else {
          setUserInfo({});
        }
        
      }).catch(err => {
        throw(err);
      });
    }
    
    axios.get("http://localhost:9000/getContract?email=" + localStorage.getItem("email")).then(res => {
      const info = res.data;
      if(info.length > 0) {
        console.log("contract found");
        setContractExists("go");
      }else{
        console.log("contract not found");
        setContractExists(null);
        setContract("go")
      }
    });

    // Set form values to existing info
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setStreet(userInfo.street);
    setCity(userInfo.city);
    setState(userInfo.state);
    setZipCode(userInfo.zipCode);
    setCardNum(userInfo.cardNum);
  }, [userInfo]);
  
  return ( 
    <div className="mt-3 container-sm w-50 p-3 border bg-light">
      <h3>Purchase</h3>
      <p>Logged in as {localStorage.getItem("email")}</p>
      <form onSubmit={requestUpdate}>
        <div className="mb-3">
          <label htmlFor="emailInput">Email address</label>
          <input 
            type="text" 
            className="form-control" 
            id="emailInput" 
            placeholder="name@example.com"
            value={localStorage.getItem("email")}
            onChange={(e) => {setFormEmail(e.target.value); setSuccess(false); setContract(null);}}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="firstNameInput">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="firstNameInput" 
            placeholder="First"
            value={firstName}
            onChange={(e) => {setFirstName(e.target.value); setSuccess(false); setContract(null);}}
          />
        </div>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            id="lastNameInput" 
            placeholder="Last"
            value={lastName}
            onChange={(e) => {setLastName(e.target.value); setSuccess(false); setContract(null);}}
          />
        </div>

        {contractExists &&
        <div>
          <div className="form-group mb-3">
          <label htmlFor="form-check">Purchasing with a Contract?</label>
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="radio" 
              name="exampleRadios" 
              id="contractRadioYes" 
              value="contract" 
              defaultChecked
              onChange={(e) => {setPurchaseMethod(e.target.value); console.log(e.target.value); setSuccess(false); setContract(null);}}
            />
            <label className="form-check-label" htmlFor="contractRadioYes">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="radio" name="exampleRadios" 
              id="contractRadioNo" 
              value="card" 
              onChange={(e) => {setPurchaseMethod(e.target.value); console.log(e.target.value); setSuccess(false); setContract("go");}}
            />
            <label className="form-check-label" htmlFor="contractRadioNo">
              No
            </label>
          </div>
          </div>
        </div>}
        
        <div className="form-group">
          <label htmlFor="inputAddress">Billing Address</label>
          <input 
            type="text" 
            className="form-control" 
            id="inputAddress"
            value={street}
            onChange={(e) => {setStreet(e.target.value); setSuccess(false);}}
          />
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">City</label>
            <input 
              type="text" 
              className="form-control" 
              id="inputCity"
              value={city}
              onChange={(e) => {setCity(e.target.value); setSuccess(false);}}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputState">State</label>
            <input 
              type="text" 
              className="form-control" 
              id="inputState"
              value={state}
              onChange={(e) => {setState(e.target.value); setSuccess(false);}}
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputZip">Zip</label>
            <input 
              type="text" 
              className="form-control" 
              id="inputZip"
              value={zipCode}
              onChange={(e) => {setZipCode(e.target.value); setSuccess(false);}}
            />
          </div>
        </div>
        {contract &&
        <div>
          <div className="form-group">
            <label htmlFor="cardInput">Card Number</label>
            <input 
              type="text" 
              className="form-control" 
              id="cardNum"
              value={cardNum}
              onChange={(e) => {setCardNum(e.target.value); setSuccess(false);}}
            />
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="cardZipInput">Card Zip</label>
              <input 
                type="text" 
                className="form-control" 
                id="cardZipInput"
                value={cardZip}
                onChange={(e) => {setCardZip(e.target.value); setSuccess(false);}}
              />
            </div>
            <div className="form-group col-md-6">
            <label htmlFor="cvvInput">Security Code</label>
            <input 
              type="text" 
              className="form-control" 
              id="secInput"
              value={CVV}
              onChange={(e) => {setCVV(e.target.value); setSuccess(false);}}
            />
            </div>
          </div>
          </div>}
        
        <button 
          className="btn btn-primary" 
          type="submit" 
          style={{marginTop: '15px' }}>Purchase
        </button>
        {errorMsg && <p className="mt-3 text-danger">Error: {errorMsg}</p>}
        {success && <p className="mt-3 text-success">Purchase made successfully.</p>}
      </form>
    </div>
);
}
  
export default ProductPurchase;