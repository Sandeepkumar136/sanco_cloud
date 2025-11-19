import React, { useState } from 'react'
import Pictures_Files from '../Pictures/Expo/FileExporter'

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
          <li className="nav-lists">Tasks</li>
          <li className="nav-lists">Schedule</li>
          <li className="nav-lists">Notes</li>
        </ul>
        </div>
        <ul className="nav-toggle-btns">
          <li className="nav-lists-t">Account</li>
          <li className="nav-toggle"><i className="bi bi-sun"></i></li>
          <li onClick={toggleSidebar} className="nav-toggle main"><i className={`bx ${isSidebarOpen? 'bx-x': 'bx-list'}`}></i></li>
        </ul>
      </nav>
      <aside className={`sidebar ${isSidebarOpen? 'open': ''}`}>
        <ul className="side-items">
          <li className="side-lists">Tasks</li>
          <li className="side-lists">Schedule</li>
          <li className="side-lists">Notes</li>
          <li className="side-lists">Account</li>
        </ul>
      </aside>
    </div>
  )
}

export default Navbar;
