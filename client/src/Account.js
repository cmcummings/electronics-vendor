import { useState, useEffect } from "react";
import axios from 'axios';

function Account(props) {
  const [userInfo, setUserInfo] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

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
            zipCode: zipCode
          });
        } else {
          setErrorMsg("Update failed.");
        }
      });
    }
  }

  useEffect(() => {
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
            zipCode: info.ZIP_CODE || ""
          });
        } else {
          setUserInfo({});
        }
        
      }).catch(err => {
        throw(err);
      });
    }

    // Set form values to existing info
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setStreet(userInfo.street);
    setCity(userInfo.city);
    setState(userInfo.state);
    setZipCode(userInfo.zipCode);
  }, [userInfo]);

  return (
    <div className="mt-3 container-md w-50 p-3 border bg-light">
      <h2>Account Info</h2>
      <p>Logged in as {localStorage.getItem("email")}</p>
      <form onSubmit={requestUpdateUserData}>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            className="form-control w-50"
            type="text"
            value={firstName}
            onChange={(e) => {setFirstName(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            className="form-control w-50"
            type="text"
            value={lastName}
            onChange={(e) => {setLastName(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            className="form-control w-50"
            type="text"
            value={street}
            onChange={(e) => {setStreet(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            className="form-control w-50"
            type="text"
            value={city}
            onChange={(e) => {setCity(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            className="form-control w-50"
            type="text"
            value={state}
            onChange={(e) => {setState(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Zip Code</label>
          <input
            className="form-control w-50"
            type="text"
            value={zipCode}
            onChange={(e) => {setZipCode(e.target.value); setSuccess(false); setErrorMsg(null);}}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
      {errorMsg && <p className="mt-3 text-danger">Error: {errorMsg}</p>}
      {success && <p className="mt-3 text-success">User info updated successfully.</p>}
      <button className="mt-5 btn btn-danger" onClick={props.logout}>
        Log out
      </button>
    </div>
  );
}
  
export default Account;