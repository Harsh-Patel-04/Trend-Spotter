import os
import re
from collections import defaultdict, Counter
from googleapiclient.discovery import build
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import praw
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# 1. Initialize NLTK first
nltk.download('vader_lexicon')

# Configure Reddit API client
reddit = praw.Reddit(
    client_id="hLsCHjkFXtuT-1ceGi9Fig",
    client_secret="KXAuafreQ8AzNTO3au3WjHT7S1igmg",
    user_agent="trend_spotter"
)

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# YouTube API setup
API_KEY = "AIzaSyB80xRZ6HWWcXXG5H4fxJp_dEAliEL-TPM"
YOUTUBE = build('youtube', 'v3', developerKey=API_KEY)

app = Flask(__name__)
CORS(app)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

# 2. YouTube trending hashtag analysis function
def get_trending_hashtags(max_results=200):
    request = YOUTUBE.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode="IN",
        maxResults=max_results
    )
    response = request.execute()
    
    hashtag_metrics = defaultdict(lambda: {'count': 0, 'video_count': 0, 'view_counts': []})
    
    for item in response['items']:
        text = item['snippet']['title'].lower() + " " + item['snippet']['description'].lower()
        video_views = int(item['statistics']['viewCount'])
        found_hashtags = set(re.findall(r"#(\w+)", text))  # Unique hashtags per video
        
        for hashtag in found_hashtags:
            hashtag_metrics[hashtag]['count'] += 1
            hashtag_metrics[hashtag]['video_count'] += 1
            hashtag_metrics[hashtag]['view_counts'].append(video_views)
    
    # Calculate trending score: (video_count * avg_views) / total_occurrences
    trending_scores = []
    for hashtag, metrics in hashtag_metrics.items():
        avg_views = sum(metrics['view_counts']) / len(metrics['view_counts']) if metrics['view_counts'] else 0
        score = (metrics['video_count'] * avg_views) / (metrics['count'] or 1)
        trending_scores.append((hashtag, score))
    
    # Sort by trending score descending
    return sorted(trending_scores, key=lambda x: x[1], reverse=True)[:10]

# 3. Sentiment analysis function
def analyze_comments_sentiment(subreddit_name, post_limit=5, comment_limit=None):
    subreddit = reddit.subreddit(subreddit_name)
    posts = subreddit.hot(limit=post_limit)
    
    sentiments = {"positive": 0, "neutral": 0, "negative": 0}
    analyzed_posts = []

    for post in posts:
        post_data = {
            "title": post.title,
            "url": post.url,
            "comments": []
        }
        
        post.comments.replace_more(limit=0)
        all_comments = post.comments.list()
        comments = all_comments if comment_limit is None else all_comments[:comment_limit]
        
        for comment in comments:
            text = comment.body
            score = analyzer.polarity_scores(text)['compound']
            
            sentiment = "neutral"
            if score >= 0.05:
                sentiment = "positive"
                sentiments["positive"] += 1
            elif score <= -0.05:
                sentiment = "negative"
                sentiments["negative"] += 1
            else:
                sentiments["neutral"] += 1
            
            post_data["comments"].append({
                "text": text,
                "sentiment": sentiment,
                "score": score
            })
        
        analyzed_posts.append(post_data)

    return {
        "subreddit": subreddit_name,
        "total_posts": len(analyzed_posts),
        "sentiment_distribution": sentiments,
        "posts": analyzed_posts
    }

# 4. Flask routes
@app.route('/dashboard')
def get_dashboard_data():
    return jsonify({
        "trends": [
            {"name": "AI", "count": 2500},
            {"name": "Cybersecurity", "count": 1800},
            {"name": "Web3", "count": 1500}
        ],
        "sentiment": [
            {"name": "positive", "value": 65, "color": "#00FF00"},
            {"name": "neutral", "value": 25, "color": "#FFFF00"},
            {"name": "negative", "value": 10, "color": "#FF0000"}
        ],
        "timeline": [
            {"date": "2023-01-01", "mentions": 1500},
            {"date": "2023-02-01", "mentions": 2200},
            {"date": "2023-03-01", "mentions": 3000}
        ]
    })

@app.route('/analyze_sentiment', methods=['POST', 'OPTIONS'])
def analyze_sentiment():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        subreddit_name = data.get('subreddit', 'technology')
        post_limit = data.get('limit', 5)
        
        results = analyze_comments_sentiment(subreddit_name, post_limit)
        
        response = jsonify(results)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response
        
    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return error_response, 500

@app.route('/get_trending_hashtags', methods=['GET'])
def get_trending_hashtags_route():
    try:
        trending_hashtags = get_trending_hashtags()
        return jsonify({
            "hashtags": [{"hashtag": f"#{hashtag}", "score": score} for hashtag, score in trending_hashtags]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(500)
def handle_500(error):
    response = jsonify({"error": "Internal server error"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, 500

@app.errorhandler(404)
def handle_404(error):
    response = jsonify({"error": "Resource not found"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
