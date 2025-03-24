import React, { useState } from "react";
import axios from 'axios';

export default function Signup({ setIsLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        id,
        password,
      });
      setMessage(response.data);
      setIsLogin(true);
    } catch (error) {
      setMessage(error.response?.data || "Signup failed.");
    }
  };

  return (
    <form
      className="bg-white p-8 rounded-xl shadow-md w-80"
      onSubmit={handleSignup}
    >
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white py-2 rounded"
        type="submit"
      >
        Signup
      </button>
      <p className="mt-4">
        Already have an account?{" "}
        <button className="text-blue-500" onClick={() => setIsLogin(true)}>
          Login
        </button>
      </p>
    </form>
  );
}
