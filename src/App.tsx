import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import DashboardLayout from './components/layout/DashboardLayout';
import BoardPage from './components/pages/BoardPage';
import LoginPage from './components/pages/LoginPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import RegisterPage from './components/pages/RegisterPage';
import HomePage from './components/pages/HomePage';
import BacklogPage from './components/pages/BacklogPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HomePage />} />

          <Route path="board" element={<BoardPage />} />
          <Route path="timeline" element={<Text>Timeline Page</Text>} />
          <Route path="backlog" element={<BacklogPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
