import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Back from './Back';
import Inputs from './Inputs';

// used to route Inputs which is the page with input fields, and Back which is the post page
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inputs />}>
        </Route>
        <Route path="/back" element={<Back />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}