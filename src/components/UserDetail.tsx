import React, { useEffect, useState } from 'react';
import { User, Assessment } from '../types';
import { ArrowLeft, Twitter, Star, Video } from 'lucide-react';
import { InterviewReview } from './InterviewReview';
import { fetchUserAssessments } from '@/redux/slices/users';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';

interface Props {
  user: User;
  onBack: () => void;
}

export const UserDetail: React.FC<Props> = ({ user, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Assessment | null>(null);
  const dispatch = useAppDispatch();
  const { assessments } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchUserAssessments(user._id))
      .finally(() => setIsLoading(false));
  }, [dispatch, user._id]);

  // Loading skeleton component
  const InterviewSkeleton = () => (
    <div className="bg-gray-700 p-4 rounded-lg animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-5 w-32 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 w-16 bg-gray-600 rounded"></div>
          <div className="h-4 w-4 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (selectedInterview) {
    return (
      <InterviewReview
        assessment={selectedInterview}
        user={user}
        onBack={() => setSelectedInterview(null)}
      />
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <button
        onClick={onBack}
        className="flex items-center text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Users
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">User Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                <p className="text-white font-medium">{user.username}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Joined</label>
                <p className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Twitter</label>
                <div className="flex items-center space-x-3">
                  {user.twitterId ? (
                    <>
                      <Twitter className="h-5 w-5 text-blue-400" />
                      <a
                        href={`https://twitter.com/i/user/${user.twitterId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        @{user.username}
                      </a>
                    </>
                  ) : (
                    <span className="text-gray-500">Not connected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-yellow-400 text-2xl font-bold">{user.xp}</p>
                <p className="text-gray-300 text-sm">XP</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-green-400 text-2xl font-bold">{user.credits}</p>
                <p className="text-gray-300 text-sm">Credits</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-blue-400 text-2xl font-bold">{user.fund.referrals.length}</p>
                <p className="text-gray-300 text-sm">Referrals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Interview History</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <InterviewSkeleton key={index} />
              ))}
            </div>
          ) : assessments.length === 0 ? (
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400">No interviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => setSelectedInterview(interview)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{user.username}'s interview</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(interview.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {interview.score ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-white">
                            {Math.round(Object.values(interview.score).reduce((sum, score) => sum + (score || 0), 0) / Object.keys(interview.score).length)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-400">No score yet</span>
                        </div>
                      )}
                      <Video className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};