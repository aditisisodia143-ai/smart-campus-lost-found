import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { studentSignup, studentLogin } from "../api/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");

  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
  }, [location.pathname]);

  // ---- Sign In state ----
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ---- Sign Up state ----
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [contact, setContact] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  function switchTo(newMode) {
    setMode(newMode);
    navigate(newMode === "signup" ? "/signup" : "/login", { replace: true });
  }

  function saveSessionAndGoHome(data) {
  localStorage.setItem("studentToken", data.token);
  localStorage.setItem("studentId", data.student.id);
  localStorage.setItem("studentName", data.student.name);
  localStorage.setItem("studentRole", data.student.role);
  navigate("/");
}
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const data = await studentLogin(loginEmail, loginPassword);
      saveSessionAndGoHome(data);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed. Check your email and password.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    try {
      const data = await studentSignup(name, signupEmail, signupPassword, contact);
      saveSessionAndGoHome(data);
    } catch (err) {
      setSignupError(err.response?.data?.message || "Signup failed. Try a different email.");
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-container ${mode === "signup" ? "right-panel-active" : ""}`}>
        {/* Sign Up form */}
        <div className="auth-form-container auth-sign-up-container">
          <form className="auth-form" onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} />
            <input type="tel" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
            {signupError && <p className="error-text">{signupError}</p>}
            <button className="btn-primary" type="submit" disabled={signupLoading}>
              {signupLoading ? "Creating account..." : "Sign Up"}
            </button>
            <p className="auth-switch-mobile">
              Already have an account?{" "}
              <button type="button" onClick={() => switchTo("login")}>Sign In</button>
            </p>
          </form>
        </div>

        {/* Sign In form */}
        <div className="auth-form-container auth-sign-in-container">
          <form className="auth-form" onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            {loginError && <p className="error-text">{loginError}</p>}
            <button className="btn-primary" type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
            <p className="auth-switch-mobile">
              New here?{" "}
              <button type="button" onClick={() => switchTo("signup")}>Sign Up</button>
            </p>
          </form>
        </div>

        {/* Sliding overlay */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Welcome Back!</h1>
              <p>Already have an account? Sign in to keep using ReUnite.</p>
              <button className="btn-ghost" onClick={() => switchTo("login")} type="button">Sign In</button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Hello, Student!</h1>
              <p>New to ReUnite? Create an account to report or claim lost items.</p>
              <button className="btn-ghost" onClick={() => switchTo("signup")} type="button">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}