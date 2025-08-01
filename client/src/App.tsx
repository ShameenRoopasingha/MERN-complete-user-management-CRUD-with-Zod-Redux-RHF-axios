import React from "react";
// import logo from './logo.svg';
import "./App.css";
import UserForm from "./components/user/UserForm";
import UserList from "./components/user/UserList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/user/LoginForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            {/* 🔹 Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<UserForm />} />

            {/* 🔐 Protected Route */}
            <Route path="/users" element={<UserList />} />

            {/* Default route */}
            <Route path="*" element={<LoginForm />} />
          </Routes>
        </BrowserRouter>
        <a hidden href="https://lordicon.com/">
          Icons by Lordicon.com
        </a>
        {/* <UserForm />
        <UserList /> */}
      </header>
    </div>
  );
}

export default App;
