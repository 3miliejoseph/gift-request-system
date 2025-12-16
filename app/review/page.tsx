'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './review.css';

export default function ReviewRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [reviewData, setReviewData] = useState({
    recipientUsername: '',
    recipientName: '',
    giftDuration: '',
    message: '',
    userId: '',
    userName: '',
    userEmail: '',
    companyName: '',
    department: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem('giftRequestData');
    if (storedData) {
      setReviewData(JSON.parse(storedData));
    }
  }, []);

  const formatDuration = (duration: string) => {
    const durations: { [key: string]: string } = {
      'one-month': 'One Month',
      'two-months': 'Two Months',
      'three-months': 'Three Months'
    };
    return durations[duration] || duration;
  };

  const handleContinueEditing = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: reviewData.userId,
          userName: reviewData.userName,
          userEmail: reviewData.userEmail,
          companyName: reviewData.companyName,
          department: reviewData.department,
          recipientUsername: reviewData.recipientUsername,
          recipientName: reviewData.recipientName,
          giftDuration: reviewData.giftDuration,
          message: reviewData.message
        }),
      });

      if (response.ok) {
        // Clear sessionStorage
        sessionStorage.removeItem('giftRequestData');
        
        // Redirect to my submissions with success message
        const params = new URLSearchParams(searchParams.toString());
        alert('✓ Gift request submitted successfully!');
        router.push(`/my-submissions?${params.toString()}`);
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-page">
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
        <h1 className="page-title">Review Your Request</h1>

        {/* Main Card */}
        <div className="main-card">
          {/* Header */}
          <div className="review-header">
            <h2>Please Review Your Information</h2>
            <p>Please confirm all details below are correct before submitting</p>
          </div>

          {/* Your Information Section */}
          <div className="info-section">
            <h3>Your Information</h3>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{reviewData.userName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{reviewData.userEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Company:</span>
              <span className="info-value">{reviewData.companyName || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Department:</span>
              <span className="info-value">{reviewData.department || 'N/A'}</span>
            </div>
          </div>

          {/* Gift Request Details Section */}
          <div className="info-section">
            <h3>Gift Request Details</h3>
            <div className="info-row">
              <span className="info-label">Gift Duration:</span>
              <span className="info-value">{formatDuration(reviewData.giftDuration)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Recipient Username:</span>
              <span className="info-value">{reviewData.recipientUsername}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Recipient Full Name:</span>
              <span className="info-value">{reviewData.recipientName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Message:</span>
              <span className="info-value">{reviewData.message || '-'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit ✓'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleContinueEditing}
              disabled={submitting}
            >
              ← Continue editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
