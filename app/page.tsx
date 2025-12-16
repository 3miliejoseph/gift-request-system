'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './page.css';

export default function GiftRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    recipientUsername: '',
    recipientName: '',
    giftDuration: '',
    message: ''
  });

  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    companyName: '',
    department: ''
  });

  useEffect(() => {
    // Get user info from URL params
    setUserInfo({
      userId: searchParams.get('userId') || '',
      userName: searchParams.get('userName') || '',
      userEmail: searchParams.get('userEmail') || '',
      companyName: searchParams.get('companyName') || '',
      department: searchParams.get('department') || ''
    });
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data in sessionStorage
    sessionStorage.setItem('giftRequestData', JSON.stringify({
      ...formData,
      ...userInfo
    }));
    
    // Navigate to review page with query params
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/review?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/my-submissions?${params.toString()}`);
  };

  return (
    <div className="gift-form-page">
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
        <h1 className="page-title">Gift Request Form</h1>

        {/* Main Card */}
        <div className="main-card">
          {/* Back Button */}
          <button className="back-button" onClick={handleBack}>
            ← Back To My Requests
          </button>

          {/* Your Information Section */}
          <div className="info-section">
            <h3>Your Information</h3>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{userInfo.userName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{userInfo.userEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Company:</span>
              <span className="info-value">{userInfo.companyName || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Department:</span>
              <span className="info-value">{userInfo.department || 'N/A'}</span>
            </div>
          </div>

          {/* Gift Request Details Form */}
          <form onSubmit={handleSubmit}>
            <h2 className="form-section-title">Gift Request Details</h2>

            <div className="form-group">
              <label htmlFor="recipientUsername">
                Recipient Username <span className="required">*</span>
              </label>
              <input 
                type="text" 
                id="recipientUsername"
                name="recipientUsername"
                placeholder="Please enter recipient's username"
                value={formData.recipientUsername}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientName">
                Recipient Full Name <span className="required">*</span>
              </label>
              <input 
                type="text" 
                id="recipientName"
                name="recipientName"
                placeholder="Please enter recipient's full name"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="giftDuration">
                Gift Duration <span className="required">*</span>
              </label>
              <select 
                id="giftDuration"
                name="giftDuration"
                value={formData.giftDuration}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select gift duration</option>
                <option value="one-month">One Month</option>
                <option value="two-months">Two Months</option>
                <option value="three-months">Three Months</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message (Optional)
              </label>
              <textarea 
                id="message"
                name="message"
                placeholder="Include a personal message..."
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Review Request →
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
