import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CyberShadowProvider } from './contexts/CyberShadowContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { Scenarios } from './pages/Scenarios';
import { LearningPath } from './pages/LearningPath';
import { SimulationLab } from './pages/SimulationLab';
import { AttackMap } from './pages/AttackMap';
import { WhatIfLab } from './pages/WhatIfLab';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { SecurityCenter } from './pages/SecurityCenter';
import { RemediationCenter } from './pages/RemediationCenter';
import { Settings } from './pages/Settings';
import { AIAssistant } from './pages/AIAssistant';
import { Auth } from './pages/Auth';
import { Welcome } from './pages/Welcome';
import { WelcomeGuide } from './pages/WelcomeGuide';

function App() {
  return (
    <AuthProvider>
      <CyberShadowProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Welcome */}
            <Route path="/" element={<Welcome />} />

            {/* Public Auth */}
            <Route path="/login" element={<Auth />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="welcome" element={<WelcomeGuide />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="digital-twin" element={<DigitalTwin />} />
                <Route path="scenarios" element={<Scenarios />} />
                <Route path="learning-path" element={<LearningPath />} />
                <Route path="simulation" element={<SimulationLab />} />
                <Route path="attack-map" element={<AttackMap />} />
                <Route path="what-if" element={<WhatIfLab />} />
                <Route path="history" element={<History />} />
                <Route path="reports" element={<Reports />} />
                <Route path="security" element={<SecurityCenter />} />
                <Route path="security/remediation" element={<RemediationCenter />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CyberShadowProvider>
    </AuthProvider>
  );
}

export default App;
