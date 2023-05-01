import React, { useState } from 'react';
import Employee from './components/Employee';
import Client from './components/Client';
import Hr from './components/Hr';

import './loginpage.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [loginType, setLoginType] = useState('employee'); // Default login type is 'employee'


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, loginType }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          setId(data.id);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        setError('An error occurred');
      });
  };

  if (isLoggedIn && loginType === 'employee' ) {
    return <Employee id={id}/>;
  }
  if (isLoggedIn && loginType === 'hr' ) {
    return <Hr />;
  }
  if (isLoggedIn && loginType === 'client' ) {
    return <Client id={id} />;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label>Login Type:</label>
            <select value={loginType} onChange={handleLoginTypeChange}>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="client">Client</option>
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default App;
