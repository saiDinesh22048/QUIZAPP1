import React, { useEffect, useState } from 'react';
import { Header, Button } from '../components/Common';
import { QuestionDisplay, VisualLeaderboard } from '../components/QuizComponents';
import { useQuiz } from '../context/QuizContext';
import { getDisplayTeamName } from '../utils/teamNames';

export const QuizPage = () => {
  const { allQuestions, undisplayedQuestions, fetchUndisplayedQuestions } = useQuiz();
  const [hiddenQuestions, setHiddenQuestions] = useState(new Set());

  useEffect(() => {
    fetchUndisplayedQuestions();
  }, []);

  // Group all questions by team, excluding hidden ones
  const questionsByTeam = allQuestions.reduce((acc, question) => {
    if (hiddenQuestions.has(question.id)) return acc;
    
    const team = question.owner || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(question);
    return acc;
  }, {});

  const handleHideQuestion = (questionId) => {
    setHiddenQuestions(prev => new Set([...prev, questionId]));
  };

  const handleShowAllQuestions = () => {
    setHiddenQuestions(new Set());
  };

  return (
    <div className="quiz-page">
      <Header
        title="Quiz Round"
        subtitle="Questions & Leaderboard"
      />

      <div className="container">
        <div className="quiz-layout">
          <div className="quiz-main">
            <QuestionDisplay />
          </div>

          <div className="quiz-sidebar">
            <VisualLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};
