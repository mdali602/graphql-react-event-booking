import React, { useState } from "react";

import "./AuthPage.css";
import { useAuth } from "../context/auth-context";

const USER_INITIAL_STATE = {
  email: "",
  password: "",
};

const AuthPage = () => {
  const [user, setUser] = useState(USER_INITIAL_STATE);
  const [isLoginPage, setIsLoginPage] = useState(true);

  const { login } = useAuth();
  const handleSwitchMode = () => {
    setIsLoginPage((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (!isLoginPage) {
      requestBody = {
        query: `
          mutation CreateUser($userInput: UserInput!) {
            createUser(userInput: $userInput) {
              _id
              email
            }
          }
        `,
        variables: {
          userInput: {
            email,
            password,
          },
        },
      };
    }

    try {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      if (resData.data.login.token) {
        const { userId, token, tokenExpiration } = resData.data.login;
        login(userId, token, tokenExpiration);
      }
      setUser(USER_INITIAL_STATE);
    } catch (err) {
      console.log("TCL -> handleSubmit -> err:", err);
    }
  };
  return (
    <form className="auth-form">
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={handleSwitchMode}>
          Switch to {isLoginPage ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
