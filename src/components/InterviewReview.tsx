import React, { useState } from 'react';
import { Interview } from '../types';
import { ArrowLeft, Star } from 'lucide-react';

interface Props {
  interview: Interview;
  onBack: () => void;
}

export const InterviewReview: React.FC<Props> = ({ interview, onBack }) => {
  const [score, setScore] = useState(interview.score || 0);
  const [feedback, setFeedback] = useState(interview.feedback || '');

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Submitting review:', { score, feedback });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to User Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Section */}
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={interview.videoUrl}
                controls
                className="w-full h-full"
                poster="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=1280&h=720"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Interview Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="text-white">{new Date(interview.date).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <p className="text-white">{interview.type}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-white">{interview.status}</p>
                </div>
                {interview.score && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Current Score:</span>
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{interview.score}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Review Interview</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Score (0-100)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Provide detailed feedback about the interview..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-400">
                  All fields are required
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};