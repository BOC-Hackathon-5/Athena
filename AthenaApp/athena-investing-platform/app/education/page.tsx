// app/education/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Education: React.FC = () => {
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

  const courses = [
    {
      title: 'Introduction to Investing',
      description: 'Learn the basics of investing and financial markets.',
      videoLink: 'https://www.youtube.com/embed/qIw-yFC-HNU?si=E3oEPlD8mXUkzqWf',
      moreInfo: 'This course provides foundational knowledge on investing, covering topics like risk, return, and asset types.'
    },
    {
      title: 'Understanding Stocks',
      description: 'A deep dive into stock markets and how they operate.',
      videoLink: 'https://www.youtube.com/embed/p7HKvqRI_Bo?si=pbOXIs5Q0ivQ3WA-',
      moreInfo: 'Gain insights into how stock markets function, including stock exchanges, pricing, and trading strategies.'
    },
    {
      title: 'Investment Strategies',
      description: 'Learn various strategies to invest your money wisely.',
      videoLink: 'https://www.youtube.com/embed/xLAxEYhXJSY?si=-HAeApSnKlaz1tuH',
      moreInfo: 'Explore different investment strategies, from value investing to growth investing, and how to implement them.'
    },
  ];

  const leaderboardData = [
    { name: 'Alice', points: 1200 },
    { name: 'Bob', points: 1100 },
    { name: 'Charlie', points: 950 },
    { name: 'Diana', points: 850 },
    { name: 'Eve', points: 800 }
  ];

  const toggleLeaderboard = () => {
    setIsLeaderboardVisible(!isLeaderboardVisible);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ATHENA EDUCATION</h1>
        <Link href="/" passHref>
          <button style={styles.backButton} title="Go back to Portfolio">
            &lt;
          </button>
        </Link>
      </div>

      {/* Leaderboard Toggle Button */}
      <button onClick={toggleLeaderboard} style={styles.leaderboardToggle}>
        {isLeaderboardVisible ? "Hide Leaderboard" : "Show Leaderboard"}
      </button>

      {/* Leaderboard Section */}
      {isLeaderboardVisible && (
        <div style={styles.leaderboardContainer}>
          <h2 style={styles.leaderboardTitle}>LEADERBOARD</h2>
          <ul style={styles.leaderboardList}>
            {leaderboardData.map((user, index) => (
              <li key={index} style={styles.leaderboardItem}>
                <span style={styles.leaderboardText}>{user.name}</span>
                <span style={styles.leaderboardPoints}>{user.points} XP</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Courses Section */}
      <div style={styles.coursesContainer}>
        {courses.map((course, index) => (
          <div key={index} style={styles.courseCard}>
            <div style={styles.videoContainer}>
              <iframe
                src={course.videoLink}
                title={course.title}
                style={styles.video}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div style={styles.courseDetails}>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.courseDescription}>{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100vh',
    padding: '10px 20px',
    backgroundColor: '#f4f4f9',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundImage: 'linear-gradient(to bottom right, #ffffff, #d4e4fc)',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.1)',
    marginBottom: '15px',
    height: '80px',
    position: 'relative',
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 'bold' as const,
    color: '#5468ff',
    textShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    letterSpacing: '1px',
    backgroundImage: 'linear-gradient(to right, #5adaff, #5468ff)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  backButton: {
    padding: '5px 10px',
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'box-shadow .15s, transform .15s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
  },
  leaderboardToggle: {
    padding: '8px 20px',
    fontSize: '1em',
    backgroundColor: '#5468ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    margin: '10px 0',
  },
  leaderboardContainer: {
    width: '100%',
    maxWidth: '550px',
    padding: '15px',
    backgroundColor: '#ececec',
    borderRadius: '20px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '10px 0',
    textAlign: 'center' as const,
    position: 'relative',
    top: '-30px',
    zIndex: '1',
    transition: 'transform 0.3s',
  },
  leaderboardTitle: {
    fontSize: '2em',
    fontWeight: 'bold' as const,
    color: '#5468ff',
    textAlign: 'center' as const,
    letterSpacing: '2px',
    marginBottom: '10px',
  },
  leaderboardList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  leaderboardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    color: '#333',
    fontWeight: 'bold' as const,
    backgroundColor: '#f8f9fa',
  },
  leaderboardText: {
    fontSize: '1em',
  },
  leaderboardPoints: {
    fontSize: '1em',
  },
  coursesContainer: {
    width: '100%',
    maxWidth: '550px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '10px',
  },
  courseCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    gap: '15px',
    transition: 'transform 0.3s',
  },
  videoContainer: {
    flex: '1',
    maxWidth: '150px',
  },
  video: {
    width: '150px',
    height: '100px',
    borderRadius: '8px',
  },
  courseDetails: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '5px',
  },
  courseDescription: {
    fontSize: '1em',
    color: '#555',
    transition: 'color 0.3s, transform 0.3s',
    ':hover': {
      color: '#007bff',
      transform: 'scale(1.02)',
    },
  },
};

export default Education;

