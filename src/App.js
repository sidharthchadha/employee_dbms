import React, { useState } from 'react';
import Client from './components/Client';
import "../src/loginpage.css"


function App() {

  const [islogged, setislogged] = useState(0);
  const [error, seterror] = useState(0);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const set_password = (event) => {
    setpassword(event.target.value);
  }
  var set_username = (event) => {
    setusername(event.target.value);

  }

  const Checklogin = () => {
    console.log(username);
    if (username === "sid") {
      seterror(0);
      setislogged(1);
    }
    else {
      seterror(1);
    }
  }
  
  const errormsg = (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>username / password not found</strong>
    </div>
  );

  const render_login_form = (
    <div className="div-center">
    <div className="card text-center ">
      <div class="card-header">
        Login
      </div>
      <div class="card-body">
        <form>
          <div className="mb-3  ">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" id="username" value={username} onChange={set_username} />

          </div>
          <div class="mb-3 ">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} id="password" onChange={set_password} />
          </div>
          <button type="submit" className="btn btn-primary position:absolute start:50" onClick={Checklogin}>Submit</button>
        </form>
      </div>
    </div>
    </div>
  );

  if (islogged) {
    return (
      <div>
        <Client />
      </div>
    );
  }
  else if (error) {
    return (
      <div>
        {errormsg}
        {render_login_form}
      </div>
    );
  }
  else {
    return (
      <div>
        {render_login_form}
      </div>
    );
  }

}


export default App;