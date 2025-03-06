import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Quiz from './components/Quiz';
import Scores from './components/Scores';
import AdminDashboard from './components/AdminDashboard';
import UsersPage from './components/UsersPage';
import QuestionsPage from './components/QuestionsPage';
import AnalyticsPage from './components/AnalyticsPage';
import AddQuestionPage from './components/AddQuestionPage';
import EditQuestion from './components/EditQuestion';
import EditUser from './components/EditUser';
import StudentDashboard from './components/StudentDashboard';
import ViewQuestions from './components/ViewQuestions';
import ViewCurriculum from './components/ViewCurriculum';
import CurriculumPage from './components/CurriculumPage'; // Updated name
import AddCurriculum from './components/AddCurriculum'; // Updated name
import EditCurriculum from './components/EditCurriculum'; // Updated name
import Footer from "./components/Footer";

const AdminHome = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
    <p className="mt-4">Select an option from the sidebar to get started.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />}>
          <Route path="quiz" element={<Quiz />} /> {/* Nested under /student */}
          <Route path="scores" element={<Scores />} /> {/* Nested under /student */}
          <Route path="view-questions" element={<ViewQuestions />} /> {/* Nested under /student */}
          <Route path="view-curriculum" element={<ViewCurriculum />} /> {/* Nested under /student */}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} /> {/* Default route for admin */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="questions/add" element={<AddQuestionPage />} />
          <Route path="questions/:id/edit" element={<EditQuestion />} />
          <Route path="curriculum" element={<CurriculumPage />} /> {/* Updated name */}
          <Route path="curriculum/add" element={<AddCurriculum />} /> {/* Updated name */}
          <Route path="curriculum-analyses/:id/edit" element={<EditCurriculum />} />{/* Updated name */}
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      
    </Router>
  );
}

export default App;