import React, { useState } from "react";
import axios from 'axios';

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        id,
        password,
      },{ withCredentials: true });
      console.log(response.data);
      
      setMessage(`Welcome, ${response.data.user.id}!`);
    } catch (error) {
      setMessage(error.response?.data || "Login failed.");
    }
  };
  return (
    <form
      className="bg-white p-8 rounded-xl shadow-md w-80"
      onSubmit={handleLogin}
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
        Login
      </button>
      <p className="mt-4">
        Don't have an account?{" "}
        <button className="text-blue-500">
          Signup
        </button>
      </p>
    </form>
  );
}
