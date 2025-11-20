import React, { useState } from 'react'
import Pictures_Files from '../Pictures/Expo/FileExporter'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [ isSidebarOpen, setIsSidebarOpen]= useState(false);
  const toggleSidebar = ()=>{
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className='navigation'>
      <nav className="navbar">
        <div className="n-logo-contain">
          <img src={Pictures_Files.nav_logo} alt="Logo" className="nav-logo" />
          <div className="n-l-t-c">
            <h5 className="nav-logo-name">Sanco</h5>
            <p className="nav-logo-subname">Cloud</p>
          </div>
        <ul className="nav-items">
          <Link to='/tasks' className="nav-lists">Tasks</Link>
          <Link to='/notes' className="nav-lists">Notes</Link>
          <Link to='/schedule' className="nav-lists">Schedule</Link>
        </ul>
        </div>
        <ul className="nav-toggle-btns">
          <Link to='/account' className="nav-lists-t">Account</Link>
          <li className="nav-toggle"><i className="bi bi-sun"></i></li>
          <li onClick={toggleSidebar} className="nav-toggle main"><i className={`bx ${isSidebarOpen? 'bx-x': 'bx-list'}`}></i></li>
        </ul>
      </nav>
      <aside className={`sidebar ${isSidebarOpen? 'open': ''}`}>
        <ul className="side-items">
          <Link to='/tasks' className="side-lists">Tasks</Link>
          <Link to='/notes' className="side-lists">Notes</Link>
          <Link to='/schedule' className="side-lists">Schedule</Link>
          <Link to='account' className="side-lists">Account</Link>
        </ul>
      </aside>
    </div>
  )
}

export default Navbar;
