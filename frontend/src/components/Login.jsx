import "../Login.css";

function Login({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>MedVault</h1>
        <p>Secure Medicine Management System</p>

        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button onClick={onLogin}>Login</button>

        <p className="register">
          Don't have an account? <span>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;