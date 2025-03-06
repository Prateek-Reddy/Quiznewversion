import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { shuffleArray } from '../utils/shuffle';

const Quiz = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Overall timer for the quiz
  const [quizFinished, setQuizFinished] = useState(false);

  // Fetch distinct courses and companies
  useEffect(() => {
    const fetchDistinct = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/distinct');
        setCourses(response.data.courses);
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching distinct values:', error);
      }
    };
    fetchDistinct();
  }, []);

  // Start quiz
  const startQuiz = async () => {
    if (!selectedCourse || !selectedCompany) {
      alert('Please select both a course and a company before starting the quiz.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/quiz/questions', {
        params: { course: selectedCourse, company: selectedCompany, limit: 10 },
      });

      if (response.data.length === 0) {
        setQuestions([]);
        setQuizStarted(true);
        alert('No questions found for the selected course and company.');
        return;
      }

      // Shuffle the options for each question
      const shuffledQuestions = response.data.map((question) => {
        const options = ['A', 'B', 'C', 'D'];
        const shuffledOptions = shuffleArray(options);
        return { ...question, shuffledOptions };
      });

      setQuestions(shuffledQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setSelectedOptions({});
      setScore(null);
      setQuizFinished(false);
      setTimeLeft(shuffledQuestions.length * 10); // Set total time for the quiz
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (error.response && error.response.status === 404) {
        setQuestions([]);
        setQuizStarted(true);
      }
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: option,
    });
  };

  // Submit quiz and save score
  const submitQuiz = useCallback(async () => {
    try {
      // Check if questions are available
      if (!questions || questions.length === 0) {
        throw new Error('No questions found. Cannot submit quiz.');
      }

      // Calculate the score
      let score = 0;
      questions.forEach((question, index) => {
        const selectedOption = selectedOptions[index];
        if (question.answer === `Option${selectedOption}`) {
          score += 1;
        }
      });

      // Save the score to the database
      const saveScoreResponse = await axios.post(
        'http://localhost:5000/api/scores',
        {
          courseCode: selectedCourse,
          company: selectedCompany,
          score: score,
          totalQuestions: questions.length,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Score saved:', saveScoreResponse.data);

      // Update the state to show the quiz is finished
      setScore(score);
      setQuizFinished(true);
      setTimeLeft(0); // Stop the timer
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  }, [questions, selectedOptions, selectedCourse, selectedCompany]);

  // Handle next question
  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  }, [currentQuestion, questions.length, submitQuiz]);

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizStarted && !quizFinished && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizFinished) {
      submitQuiz(); // Automatically submit the quiz when time runs out
    }
  }, [quizStarted, quizFinished, timeLeft, submitQuiz]);

  return (
    <div className="min-h-screen bg-[#f0e1cb] p-8">
      {!quizStarted ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-[#007367] mb-6">Quiz Setup</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#005f56] mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              >
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#005f56] mb-2">Select Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-3 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              >
                <option value="">Select Company</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="w-full mt-6 bg-[#007367] text-white py-3 rounded-md hover:bg-[#005f56] transition-colors"
          >
            Start Quiz
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">No Questions Found</h2>
          <p className="text-lg mb-4">No questions found for the selected course and company.</p>
          <button
            onClick={() => setQuizStarted(false)}
            className="w-full bg-[#007367] text-white py-3 rounded-md hover:bg-[#005f56] transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      ) : !quizFinished ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#007367] h-2.5 rounded-full"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#007367] mb-4">{questions[currentQuestion].pyq}</h2>
          <div className="space-y-3">
            {questions[currentQuestion].shuffledOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-3 rounded-md text-left ${
                  selectedOptions[currentQuestion] === option
                    ? 'bg-[#007367] text-white'
                    : 'bg-[#f0e1cb] hover:bg-[#e0d1bb]'
                }`}
              >
                {questions[currentQuestion][`option_${option.toLowerCase()}`]}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc]"
            >
              Previous
            </button>
            <button
              onClick={currentQuestion === questions.length - 1 ? submitQuiz : handleNext}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56]"
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>

          <div className="mt-4">
            <p className="text-lg">Time Left: {timeLeft} seconds</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">Quiz Completed!</h2>
          <p className="text-lg">Your Score: {score} / {questions.length}</p>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={startQuiz}
              className="w-full bg-[#007367] text-white py-3 rounded-md hover:bg-[#005f56] transition-colors"
            >
              Restart Quiz
            </button>
            <button
              onClick={() => setQuizStarted(false)}
              className="w-full bg-[#005f56] text-white py-3 rounded-md hover:bg-[#004f46] transition-colors"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;