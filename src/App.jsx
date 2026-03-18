import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Layout/navBar';
import Home from './pages/Home';
import Builder from './pages/builder';
import { InfoProvider } from './context/infoContext';



function App() {
  return (
    <div >
      <Router>
        <InfoProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
          </Routes>
        </InfoProvider>
      </Router>
    </div>
  );
}

export default App;
