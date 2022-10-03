import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Login(props) {
    const [loginError, setLoginError] = useState();
    const [formEmail, setFormEmail] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    function tryLogin(e) {
        e.preventDefault(); // Prevent refreshing
        // Try logging in
        props.login(formEmail, result => {
          // Display error message if login failed
          if (result.success) {
            let returnLocation = searchParams.get("r");
            console.log("Login success.");
            if(returnLocation !== null) {
              window.location.replace('/' + returnLocation);
            } else {
              window.location.replace('/account');
            }
          } else {
            setLoginError(result.msg);
          }
        }); 
    };

    return ( 
        <div className="mt-3 container-sm w-25 p-3 border bg-light">
          <h3>Log in</h3>
          <p>If an account with the entered email does not exist, it will automatically be created for you.</p>
          <form onSubmit={tryLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="text" onChange={e => {setFormEmail(e.target.value); setLoginError()}} />
              <div className="form-text">6-40 characters</div>
            </div>
            <button className="btn btn-primary" type="submit">Log in</button>
          </form>
          {
            loginError &&
            <p className="mt-3 text-danger">
              Error: {loginError}
            </p>
          }
        </div>
    );
}

export default Login;