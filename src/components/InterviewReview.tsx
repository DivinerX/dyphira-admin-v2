import React, { useState } from 'react';
import { Assessment, User } from '../types';
import {
  ArrowLeft,
  Brain, // for IQ
  Megaphone, // for evangelism
  Target, // for determination
  Zap, // for effectiveness
  Eye, // for vision
  Star,
  TwitterIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { setScoreAssessment } from '@/redux/slices/users';
import { useAppDispatch } from '@/redux/hook';
import { toast } from 'react-toastify';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

interface Props {
  assessment: Assessment;
  onBack: () => void;
  user: User;
}

interface ScoreCategories {
  IQ: number;
  evangelism: number;
  determination: number;
  effectiveness: number;
  vision: number;
}

const categoryConfig = {
  IQ: {
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  },
  evangelism: {
    icon: Megaphone,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  determination: {
    icon: Target,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  effectiveness: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  vision: {
    icon: Eye,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  socialCapital: {
    icon: TwitterIcon,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    borderColor: 'border-indigo-400/20'
  }
};

export const InterviewReview: React.FC<Props> = ({ assessment, onBack }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<ScoreCategories>({
    IQ: assessment.score?.IQ || 0,
    evangelism: assessment.score?.evangelism || 0,
    determination: assessment.score?.determination || 0,
    effectiveness: assessment.score?.effectiveness || 0,
    vision: assessment.score?.vision || 0,
  });
  const [feedback, setFeedback] = useState(assessment.feedback || '');
  const handleSubmit = () => {
    setIsSubmitting(true);
    dispatch(setScoreAssessment({ assessmentId: assessment._id, data: { score, feedback } }))
      .then(() => {
        setIsSubmitting(false);
        toast.success('Review submitted successfully');
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error('Failed to submit review');
      });
  };

  const handleScoreChange = (category: keyof ScoreCategories, value: number) => {
    setScore(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const calculateTotalScore = () => {
    const total = Object.values(score).reduce((sum: number, score: number) => sum + score, 0);
    return Math.round(total / 5); // Average of all scores
  };

  const radarData = {
    labels: [...Object.keys(score)],
    datasets: [
      {
        data: [...Object.values(score)],
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 1.5,
        pointBackgroundColor: Object.keys(score).map(
          category => categoryConfig[category as keyof typeof categoryConfig].color.replace('text-', 'rgba(').replace('400', '500, 0.9)')
        ),
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 4,
        pointHoverRadius: 5,
      }
    ]
  };

  const radarOptions: ChartOptions<'radar'> = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.05)',
          lineWidth: 1,
          display: true
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          circular: false,
          lineWidth: 1
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
            weight: 'normal'
          },
          padding: 8
        },
        ticks: {
          display: false,
          stepSize: 20
        },
        min: 0,
        max: 100,
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 8,
        cornerRadius: 4,
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        },
        callbacks: {
          label: (context: any) => {
            return `Score: ${context.raw}`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
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
                src={assessment.videoUrl}
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
                  <p className="text-white">{new Date(assessment.completedAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-white">{assessment.status}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-center bg-indigo-400/10 border border-indigo-400/20 p-3 rounded-lg mb-2">
                    <span className="text-gray-300 mr-2">Average Score:</span>
                    <Star className="h-5 w-5 text-indigo-400 mr-1" />
                    <span className="text-white text-lg font-semibold">{calculateTotalScore()}</span>
                    <span className="text-gray-400 text-sm ml-2">/100</span>
                  </div>
                  {/* Radar Chart */}
                  <div className="bg-gray-700/50 p-3 rounded-lg mb-2">
                    <div className="h-[220px] relative">
                      <Radar
                        data={radarData}
                        options={radarOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Review Interview</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Score Inputs */}
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(score).map(([category, value]) => {
                    const config = categoryConfig[category as keyof typeof categoryConfig];
                    const Icon = config.icon;
                    return (
                      <div key={category} className={`${config.bgColor} border ${config.borderColor} p-2 rounded-lg`}>
                        <div className="flex items-center mb-1">
                          <Icon className={`h-4 w-4 ${config.color} mr-2`} />
                          <span className="text-gray-300 text-sm">{category}</span>
                          <span className="text-white font-semibold ml-auto">{value}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) => handleScoreChange(category as keyof ScoreCategories, Number(e.target.value))}
                            className="flex-1 h-1 accent-indigo-500"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) => handleScoreChange(category as keyof ScoreCategories, Number(e.target.value))}
                            className="w-12 px-1 py-0.5 bg-gray-600 border border-gray-500 rounded text-white text-xs text-center"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
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
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.5 : 1 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};