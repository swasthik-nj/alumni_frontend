import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  MessageSquare, 
  Star, 
  Calendar, 
  Users, 
  Send, 
  TrendingUp,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import Nav from './Nav';

const Community = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);
  
  // Feedback form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/community/sessions');
      setSessions(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionFeedbacks = async (sessionId) => {
    try {
      const res = await api.get(`/api/v1/community/sessions/${sessionId}/feedbacks`);
      setFeedbacks(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleSessionClick = (session) => {
    if (expandedSession === session._id) {
      setExpandedSession(null);
      setSelectedSession(null);
      setFeedbacks([]);
      setShowFeedbackForm(false);
    } else {
      setExpandedSession(session._id);
      setSelectedSession(session);
      fetchSessionFeedbacks(session._id);
      setShowFeedbackForm(false);
      setRating(0);
      setComment('');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/v1/community/feedback', {
        sessionId: selectedSession._id,
        feedbackRating: rating,
        comment: comment.trim()
      });
      
      alert('Feedback submitted successfully!');
      setRating(0);
      setComment('');
      setShowFeedbackForm(false);
      fetchSessionFeedbacks(selectedSession._id);
      fetchSessions(); // Refresh to update average ratings
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating: currentRating, size = 'w-5 h-5', interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              interactive ? 'cursor-pointer transition-all' : ''
            } ${
              star <= (interactive ? (hoverRating || rating) : currentRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600'
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading community sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-slate-400 to-slate-500">
      {/* Header */}
      <Nav/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sessions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No sessions available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden  transition-all"
              >
                {/* Session Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-900/70 transition"
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{session.sessionName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.sessionType === 'career' ? 'bg-blue-500/20 text-blue-300' :
                          session.sessionType === 'networking' ? 'bg-green-500/20 text-green-300' :
                          session.sessionType === 'cultural' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {session.sessionType}
                        </span>
                      </div>
                      
                      {session.description && (
                        <p className="text-gray-400 text-sm mb-3">{session.description}</p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          {session.totalRegistrations || 0} registered
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-400" />
                          {session.totalFeedbacks || 0} feedbacks
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {session.averageRating ? (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <StarRating rating={Math.round(session.averageRating)} size="w-4 h-4" />
                            <span className="text-yellow-400 font-bold">{session.averageRating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Average Rating</p>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No ratings yet</div>
                      )}
                      
                      {expandedSession === session._id ? (
                        <ChevronUp className="w-6 h-6 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Section - Feedbacks */}
                {expandedSession === session._id && (
                  <div className="border-t border-slate-800 bg-slate-950/50">
                    <div className="p-6">
                      {/* Submit Feedback Button */}
                      {!showFeedbackForm && (
                        <button
                          onClick={() => setShowFeedbackForm(true)}
                          className="w-full mb-6 py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Submit Your Feedback
                        </button>
                      )}

                      {/* Feedback Form */}
                      {showFeedbackForm && (
                        <form onSubmit={handleSubmitFeedback} className="mb-6 p-6 bg-slate-900/70 rounded-xl border border-cyan-800/30">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-cyan-400" />
                            Share Your Experience
                          </h4>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Rate this session *
                            </label>
                            <StarRating rating={rating} size="w-8 h-8" interactive={true} />
                            {rating > 0 && (
                              <p className="text-sm text-cyan-400 mt-2">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                              </p>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Your Comment (Optional)
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Share your thoughts about this session..."
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 py-2 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Submit Feedback
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowFeedbackForm(false);
                                setRating(0);
                                setComment('');
                              }}
                              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Feedbacks List */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-400" />
                          Community Feedback ({feedbacks.length})
                        </h4>
                        
                        {feedbacks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No feedback yet. Be the first to share!</p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                            {feedbacks.map((feedback) => (
                              <div
                                key={feedback._id}
                                className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-white">{feedback.alumni?.alumniName || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{feedback.alumni?.department}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <StarRating rating={feedback.feedbackRating} size="w-4 h-4" />
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      {formatDate(feedback.createdAt)}
                                    </div>
                                  </div>
                                </div>
                                {feedback.comment && (
                                  <p className="text-gray-300 text-sm mt-2">{feedback.comment}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
