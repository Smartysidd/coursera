import React from 'react';
import './Layout.css';
import Navbar from '../UI/Navigation/Navbar/Navbar';

function Layout(props) {
  return (
    <>
      <Navbar />
      <main className="Content">
        {props.children}
      </main>
    </>
  );
}

export default Layout;
