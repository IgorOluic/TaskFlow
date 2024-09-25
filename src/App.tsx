import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import DashboardLayout from './components/layout/DashboardLayout';
import BoardPage from './components/pages/BoardPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="" element={<BoardPage />} />
          <Route path="timeline" element={<Text>Timeline Page</Text>} />
        </Route>

        <Route path="/login" element={<Text>Login</Text>} />
      </Routes>
    </Router>
  );
};

export default App;
