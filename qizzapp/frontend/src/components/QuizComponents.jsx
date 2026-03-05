import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Button, Badge } from './Common';
import { getDisplayTeamName } from '../utils/teamNames';

export const QuestionDisplay = ({ playerId }) => {
  const { currentQuestion, currentAnswer, showAnswer } = useQuiz();

  if (!currentQuestion) {
    return <div className="question-display empty">Waiting for question from admin...</div>;
  }

  return (
    <div className="question-display">
      <div className="question-content">
        <div className="question-header">
          <h2>{currentQuestion.cricketer}</h2>
          {currentQuestion.owner && (
            <Badge text={`Owned by ${getDisplayTeamName(currentQuestion.owner)}`} variant="info" />
          )}
        </div>

        <div className="question-body">
          <p className="question-text">
            <strong>Q:</strong> {currentQuestion.question}
          </p>

          {/* Display Options */}
          {(currentQuestion.option_a || currentQuestion.option_b || currentQuestion.option_c || currentQuestion.option_d) && (
            <div className="options-container">
              <div className="options-label"><strong>Options:</strong></div>
              <div className="options-grid">
                {currentQuestion.option_a && (
                  <div className="option-item">
                    <span className="option-label">A)</span>
                    <span className="option-text">{currentQuestion.option_a}</span>
                  </div>
                )}
                {currentQuestion.option_b && (
                  <div className="option-item">
                    <span className="option-label">B)</span>
                    <span className="option-text">{currentQuestion.option_b}</span>
                  </div>
                )}
                {currentQuestion.option_c && (
                  <div className="option-item">
                    <span className="option-label">C)</span>
                    <span className="option-text">{currentQuestion.option_c}</span>
                  </div>
                )}
                {currentQuestion.option_d && (
                  <div className="option-item">
                    <span className="option-label">D)</span>
                    <span className="option-text">{currentQuestion.option_d}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {showAnswer && (
            <div className="answer-reveal">
              <p className="answer-text">
                <strong>A:</strong> {currentQuestion.answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const VisualLeaderboard = () => {
  const { leaderboard } = useQuiz();

  // Sort leaderboard by score descending, filter out invalid scores
  const validLeaderboard = leaderboard.filter(team => 
    team && typeof team.score === 'number' && !isNaN(team.score)
  );
  const sortedLeaderboard = [...validLeaderboard].sort((a, b) => b.score - a.score);
  const maxScore = sortedLeaderboard.length > 0 
    ? Math.max(...sortedLeaderboard.map(team => team.score)) 
    : 1;

  return (
    <div className="visual-leaderboard">
      <h3>🏆 Leaderboard</h3>
      <div className="leaderboard-bars">
        {sortedLeaderboard.map((team, index) => {
          const percentage = (team.score / maxScore) * 100;
          return (
            <div key={team.id} className="leaderboard-item">
              <div className="leaderboard-info">
                <div className="rank-badge">#{index + 1}</div>
                <div className="team-name">{getDisplayTeamName(team.name)}</div>
                <div className="score-value">{team.score}</div>
              </div>
              <div className="bar-container">
                <div 
                  className="score-bar" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {sortedLeaderboard.length === 0 && (
        <div className="empty-leaderboard">
          <p>No scores yet</p>
        </div>
      )}
    </div>
  );
};

export const QuestionManager = () => {
  const { allQuestions, sendCurrentQuestion, sendAnswer, resetQuiz, updateTeamScore, leaderboard, loading, removeQuestion } = useQuiz();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newScore, setNewScore] = useState('');

  // Group questions by team, excluding displayed ones
  const questionsByTeam = allQuestions.reduce((acc, question) => {
    const team = question.owner || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(question);
    return acc;
  }, {});

  const handleSendQuestion = async () => {
    if (!selectedQuestion) return;
    
    try {
      await sendCurrentQuestion(selectedQuestion.id);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error sending question:', error);
    }
  };

  const handleSendAnswer = async () => {
    try {
      await sendAnswer();
    } catch (error) {
      console.error('Error sending answer:', error);
    }
  };

  const handleResetQuiz = async () => {
    if (window.confirm('Are you sure you want to reset the quiz? This will clear all displayed questions and scores.')) {
      try {
        await resetQuiz();
      } catch (error) {
        console.error('Error resetting quiz:', error);
      }
    }
  };

  const handleScoreChange = async (teamId, currentScore) => {
    const scoreValue = newScore.trim() === '' ? 0 : parseInt(newScore);
    if (isNaN(scoreValue)) {
      alert('Please enter a valid number for the score');
      return;
    }
    
    try {
      await updateTeamScore(teamId, scoreValue);
      setEditingTeam(null);
      setNewScore('');
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update score. Please try again.');
    }
  };

  const handleRemoveQuestion = async (questionId, questionName) => {
    if (window.confirm(`Are you sure you want to permanently remove the question for "${questionName}"? This action cannot be undone.`)) {
      try {
        await removeQuestion(questionId);
        if (selectedQuestion?.id === questionId) {
          setSelectedQuestion(null);
        }
      } catch (error) {
        console.error('Error removing question:', error);
      }
    }
  };

  return (
    <div className="question-manager">
      <div className="question-controls">
        <div className="control-buttons">
          <Button 
            onClick={handleSendQuestion}
            disabled={!selectedQuestion || loading}
            variant="primary"
          >
            📤 Send Question
          </Button>
          <Button 
            onClick={handleSendAnswer}
            disabled={loading}
            variant="success"
          >
            ✅ Send Answer
          </Button>
          <Button 
            onClick={handleResetQuiz}
            disabled={loading}
            variant="danger"
          >
            🔄 Reset Quiz
          </Button>
        </div>
      </div>

      <div className="questions-by-team">
        {Object.entries(questionsByTeam).map(([teamName, questions]) => (
          <div key={teamName} className="team-questions">
            <h4>{getDisplayTeamName(teamName)} ({questions.length} questions)</h4>
            <div className="questions-list">
              {questions.map((question) => (
                <div 
                  key={question.id} 
                  className={`question-item ${selectedQuestion?.id === question.id ? 'selected' : ''}`}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div className="question-info">
                    <strong>{question.cricketer}</strong>
                    <p>{question.question.substring(0, 100)}...</p>
                  </div>
                  <div className="question-actions">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuestion(question);
                      }}
                      variant="secondary"
                      className="btn-sm"
                    >
                      Select
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(question.id, question.cricketer);
                      }}
                      variant="danger"
                      className="btn-sm"
                      title="Permanently remove this question"
                    >
                      🗑️ Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Management */}
      <div className="leaderboard-management">
        <h4>Manage Scores</h4>
        <div className="leaderboard-table">
          {leaderboard.map((team, index) => (
            <div key={team.id} className="table-row">
              <div className="rank">
                <strong>#{index + 1}</strong>
              </div>
              <div className="team">{getDisplayTeamName(team.name)}</div>
              <div className="score">
                {editingTeam === team.id ? (
                  <input
                    type="number"
                    value={newScore}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numeric values
                      if (value === '' || /^\d+$/.test(value)) {
                        setNewScore(value);
                      }
                    }}
                    autoFocus
                    min="0"
                  />
                ) : (
                  <strong>{team.score}</strong>
                )}
              </div>
              <div className="actions">
                {editingTeam === team.id ? (
                  <>
                    <Button 
                      onClick={() => handleScoreChange(team.id, team.score)}
                      variant="primary"
                      className="btn-sm"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => setEditingTeam(null)}
                      variant="secondary"
                      className="btn-sm"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      setEditingTeam(team.id);
                      setNewScore(team.score);
                    }}
                    variant="secondary"
                    className="btn-sm"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
