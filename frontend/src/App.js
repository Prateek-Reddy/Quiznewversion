import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; // Student Home Page
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
import CurriculumPage from './components/CurriculumPage';
import AddCurriculum from './components/AddCurriculum';
import EditCurriculum from './components/EditCurriculum';
import CompanyRoundsPage from './components/CompanyRoundsPage';
import StudentHiringAdminPage from './components/StudentHiringAdminPage'; 
import TypeOfRoundsAdminPage from './components/TypeOfRoundsAdminPage';
import CompanySalariesAdminPage from './components/CompanySalariesAdminPage';
import Footer from './components/Footer';
import AdminHome from './components/AdminHome'; // Import the AdminHome component
import DataVizMainPage from './DataVizPages/DataVizMainPage';
import OnlinevsOffline from './DataVizPages/OnlinevsOffline';
import OnlinevsOfflineSummary from './DataVizPages/OnlinevsOfflineSummary';
import TotalHiredTrend from './DataVizPages/TotalHiredTrend';
import GenderWisePieChart from './DataVizPages/GenderWisePieChart';
import SubjectWiseBreakdown from './DataVizPages/SubjectWiseBreakdown';
import RoundTypeBreakdown from './DataVizPages/RoundTypeBreakdown';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<Home />} /> {/* Default route for student */}
          <Route path="home" element={<Home />} />
          <Route path="quiz" element={<Quiz />} /> {/* Nested under /student */}
          <Route path="scores" element={<Scores />} /> {/* Nested under /student */}
          <Route path="view-questions" element={<ViewQuestions />} /> {/* Nested under /student */}
          <Route path="view-curriculum" element={<ViewCurriculum />} /> {/* Nested under /student */}
          <Route path="data-viz" element={<DataVizMainPage />} />
          <Route path="online-vs-offline" element={<OnlinevsOffline />} />
          <Route path="online-vs-offline-summary" element={<OnlinevsOfflineSummary />} />
          <Route path="total-hired-trend" element={<TotalHiredTrend />} />
          <Route path="gender-wise-pie-chart" element={<GenderWisePieChart />} />
          <Route path="subject-wise-breakdown" element={<SubjectWiseBreakdown />} />
          <Route path="round-type-breakdown" element={<RoundTypeBreakdown />} />

        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} /> {/* Default route for admin */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="questions/add" element={<AddQuestionPage />} />
          <Route path="questions/:id/edit" element={<EditQuestion />} />
          <Route path="curriculum" element={<CurriculumPage />} />
          <Route path="curriculum/add" element={<AddCurriculum />} />
          <Route path="curriculum-analyses/:id/edit" element={<EditCurriculum />} />
          <Route path="company-rounds" element={<CompanyRoundsPage />} /> 
          <Route path="student-hiring" element={<StudentHiringAdminPage />} />
          <Route path="typeofrounds" element={<TypeOfRoundsAdminPage />} />
          <Route path="company-salaries" element={<CompanySalariesAdminPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;