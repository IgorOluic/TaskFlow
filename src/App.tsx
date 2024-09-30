import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import ProjectLayout from './components/layout/ProjectLayout';
import BoardPage from './components/pages/BoardPage';
import LoginPage from './components/pages/LoginPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import RegisterPage from './components/pages/RegisterPage';
import HomePage from './components/pages/HomePage';
import BacklogPage from './components/pages/BacklogPage';
import NewProjectPage from './components/pages/NewProjectPage';
import TopBarLayout from './components/layout/TopBarLayout';
import ProjectsPage from './components/pages/ProjectsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <TopBarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/new-project" element={<NewProjectPage />} />

          <Route path="/projects" element={<ProjectsPage />} />

          <Route path="/projects/:projectKey" element={<ProjectLayout />}>
            <Route path="" element={<HomePage />} />

            <Route path="board" element={<BoardPage />} />
            <Route path="timeline" element={<Text>Timeline Page</Text>} />
            <Route path="backlog" element={<BacklogPage />} />
          </Route>
        </Route>

        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
