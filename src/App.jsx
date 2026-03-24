import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Layout/navBar';
import Home from './pages/Home';
import Builder from './pages/builder';
import Jobs from './pages/Jobs';
import SkillRecommendations from './pages/SkillRecommendations';
import { InfoProvider } from './context/infoContext';



function App() {
  return (
    <div >
      <Router>
        <InfoProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/skill-recommendations" element={<SkillRecommendations />} />
          </Routes>
        </InfoProvider>
      </Router>
    </div>
  );
}

export default App;
