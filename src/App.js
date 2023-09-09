import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Cart from './Pages/Cart/Cartt';
import Homepage from './Pages/HomePage/Homepagee';
// import Preference from './Pages/HomePage/Preference';
// import CoursePage from './Pages/CoursePage/CoursePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/:CourseName" element={<Homepage />} />
        {/* <Route path="/home/Interest/Preference" element={<Preference />} />
        <Route path="/course/:Course/:Courseid" element={<CoursePage />} /> */}
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
