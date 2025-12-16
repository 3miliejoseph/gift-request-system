'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './my-submissions.css';

interface Submission {
  id: string;
  createdAt: string;
  recipientUsername: string;
  recipientName: string;
  giftDuration: string;
  message: string;
  status: string;
}

export default function MySubmissions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const name = searchParams.get('userName');
    
    if (name) setUserName(name);
    
    if (userId) {
      fetchSubmissions(userId);
    }
  }, [searchParams]);

  const fetchSubmissions = async (userId: string) => {
    try {
      const response = await fetch(`/api/submissions?userId=${userId}`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    // Pass all query params to the main form page
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatDuration = (duration: string) => {
    const durations: { [key: string]: string } = {
      'one-month': 'One Month',
      'two-months': 'Two Months',
      'three-months': 'Three Months'
    };
    return durations[duration] || duration;
  };

  return (
    <div className="submissions-page">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <svg width="200" height="50" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 30C20 24 24 20 30 20C36 20 40 24 40 30C40 36 36 40 30 40C24 40 20 36 20 30Z" fill="#4A9FD8"/>
            <path d="M40 30C40 36 44 40 50 40C56 40 60 36 60 30C60 24 56 20 50 20C44 20 40 24 40 30Z" fill="#5DADE2"/>
            <text x="75" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#1E5A7D">Into</text>
            <text x="145" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#2C3E50">Bridge</text>
            <text x="75" y="52" fontFamily="Arial, sans-serif" fontSize="12" fill="#4A9FD8">.com</text>
          </svg>
        </div>

        {/* Page Title */}
        <h1 className="page-title">My Gift Requests</h1>

        {/* Main Card */}
        <div className="main-card">
          {/* Header Section */}
          <div className="header-section">
            <div className="welcome-text">
              <h2>Welcome, {userName || 'User'}!</h2>
              <p>Manage your gift requests below:</p>
            </div>
            <button className="new-request-btn" onClick={handleNewRequest}>
              + New Request
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading">Loading your requests...</div>
            ) : submissions.length === 0 ? (
              <div className="empty-state">
                <p>No gift requests yet.</p>
                <button className="new-request-btn" onClick={handleNewRequest}>
                  Create your first request
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Recipient Username</th>
                    <th>Recipient Name</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{formatDate(submission.createdAt)}</td>
                      <td>{formatDuration(submission.giftDuration)}</td>
                      <td>{submission.recipientUsername}</td>
                      <td>{submission.recipientName}</td>
                      <td>
                        <span className={`status-badge status-${submission.status.toLowerCase()}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="message-cell">{submission.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
