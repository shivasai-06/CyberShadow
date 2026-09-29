import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { Scenarios } from './pages/Scenarios';
import { SimulationLab } from './pages/SimulationLab';
import { AttackMap } from './pages/AttackMap';
import { WhatIfLab } from './pages/WhatIfLab';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { SecurityCenter } from './pages/SecurityCenter';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="simulation" element={<SimulationLab />} />
          <Route path="attack-map" element={<AttackMap />} />
          <Route path="what-if" element={<WhatIfLab />} />
          <Route path="history" element={<History />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<SecurityCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
