import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./SignUp.css";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState("");
  const [state, setState] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  async function onSignUpFormSubmit(userObj) {
    try {
      let res;
      if (userObj.userType === 'faculty') {
        res = await axios.post("http://localhost:4000/faculty-api/register", userObj);
      } else if (userObj.userType === 'admin') {
        res = await axios.post("http://localhost:4000/admin-api/register", userObj);
      } else {
        res = await axios.post("http://localhost:4000/hod-api/register", userObj);
      }

      if (res && res.data.message === `${userObj.userType.charAt(0).toUpperCase() + userObj.userType.slice(1)} created`) {
        setState(true);
        setSignupSuccess(true);
        setErr("");
        navigate('/login');
      } else if (res) {
        setErr(res.data.message);
      } else {
        setErr("Unexpected error occurred");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              {signupSuccess ? (
                <div>
                  <p className="lead fs-3 text-center display-4 text-success">
                    User registration success
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Proceed to <Link to="/login">Login</Link>
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Back to <Link to="/">Home</Link>
                  </p>
                </div>
              ) : (
                <h2 className="p-3">Signup</h2>
              )}
            </div>
            <div className="card-body">
              {err && <p className="lead text-center text-danger">{err}</p>}

              <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="user"
                    className="form-check-label me-3"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Register as
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="faculty"
                      value="faculty"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="faculty"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      Faculty
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="admin"
                      value="admin"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="admin"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      Admin
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="hod"
                      value="hod"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="hod"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      HOD
                    </label>
                  </div>
                </div>
                {errors.userType?.type === "required" && (
                  <p className="text-danger">Please select a User type</p>
                )}

                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", { 
                      required: true,
                      minLength: 4,
                      maxLength: 10,
                      disabled: state 
                    })}
                  />
                  {errors.username?.type === "required" && (
                    <p className="text-danger">Username is required</p>
                  )}
                  {errors.username?.type === "minLength" && (
                    <p className="text-danger">Min length should be 4</p>
                  )}
                  {errors.username?.type === "maxLength" && (
                    <p className="text-danger">Max length should be 10</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", { 
                      required: true,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      disabled: state 
                    })}
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-danger">Password is required</p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p className="text-danger">
                      Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email", { 
                      required: true,
                      pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      disabled: state 
                    })}
                  />
                  {errors.email?.type === "required" && (
                    <p className="text-danger">Email is required</p>
                  )}
                  {errors.email?.type === "pattern" && (
                    <p className="text-danger">Email is not valid</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    {...register("id", { 
                      required: true,
                      disabled: state 
                    })}
                  />
                  {errors.id?.type === "required" && (
                    <p className="text-danger">ID is required</p>
                  )}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn text-light main-bg">
                    Signup
                  </button>
                </div>

                <p className="text-center text-muted mt-4">
                  Have an account?{" "}
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
