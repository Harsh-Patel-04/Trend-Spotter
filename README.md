rend Spotter Analytics Dashboard
This project is a full-stack web application that provides real-time analysis of trending Reddit posts and YouTube hashtags. It features sentiment analysis on Reddit comments and visualizes trends using various charts and metrics.

Overview
Trend Spotter Analytics helps users explore what is currently popular on Reddit and YouTube. The application fetches live data from both platforms and performs sentiment analysis on Reddit comments. The dashboard includes:

Reddit trends with upvote counts

Sentiment analysis pie chart of Reddit comments

Bubble chart showing virality clustering

Trending YouTube hashtags with virality metrics

Technologies Used
Frontend:

React.js (Vite)

Recharts for chart visualizations

Axios for API communication

Tailwind CSS for styling

Backend:

Flask

Flask-CORS

PRAW (Python Reddit API Wrapper)

Google API Client (YouTube)

NLTK and VADER for sentiment analysis

How to Run the Project
Clone the repository and navigate to the project folder.

Set up the backend:

Navigate to the backend directory if separated.

Install the required dependencies using pip.

Run the Flask server. It will start on http://localhost:5000 by default.

Set up the frontend:

Navigate to the frontend directory.

Install the required npm packages.

Start the development server using Vite. It will run on http://localhost:5173.

Make sure both servers are running for the application to function correctly.

API Endpoints
/dashboard – Fetches Reddit trends, sentiments, and virality data

/analyze_sentiment – Accepts subreddit input and returns sentiment analysis

/get_trending_hashtags – Returns top trending YouTube hashtags and metrics

Notes
Ensure that your Reddit API credentials and YouTube API key are correctly configured in the backend. This project was created as part of a mini-project for exploring real-time social media trends.
