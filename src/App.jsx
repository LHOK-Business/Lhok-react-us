// ROOT COMPONENT — the top of your component tree.
//   Everything in your app is a child (or grandchild, etc.) of App.

//   App does two jobs:
//   1. Sets up the ROUTER — maps URL paths to page components
//   2. Sets the LAYOUT — Header and Footer wrap around all pages

//   Component Tree (what renders on /about):
//   ┌── App
//   │   ├── Header        (always visible)
//   │   ├── Routes
//   │   │   └── About     (only on /about)
//   │   └── Footer        (always visible)

// React Router — these three work together:
// HashRouter  → manages URL state using the # character
//               Use this for GitHub Pages (explained below)
// Routes      → container that looks at the URL and picks the right Route
// Route       → maps one URL path to one component


import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
//Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MobileTabBar from './components/MobileTabBar/MobileTabBar';
// Pages
import About   from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Home    from './pages/Home/Home';
import StyleSheet from './pages/StyleSheet/StyleSheet';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Feedback from './pages/Feedback/Feedback';
import Admin from './pages/Admin/Admin';
import Professionals from './pages/Professionals/Professionals';
import TnC   from './pages/TnC/TnC';
import PnP   from './pages/PnP/PnP';

function App() {
    return (
        <HashRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main>
                <Routes>
                    {/* add beta banner below */}
                <Route path="/" element={<Home />} /> 
                <Route path="/about"   element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* add one for feedback */}
                {/* <Route path="/StyleSheet" element={<StyleSheet />} /> */}
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/feedback" element={<Feedback />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/admin" element={<Admin />} /> */}
                {/* <Route path="/professionals" element={<Professionals />} /> */}
                {/* <Route path="/terms" element={<TnC />} /> */}
                {/* <Route path="/privacy" element={<PnP />} /> */}
                </Routes>
            </main>
            <Footer />
            <MobileTabBar />
            </div>
        </HashRouter>
    );
}

export default App;