import os
import re
from collections import defaultdict
from datetime import datetime
from googleapiclient.discovery import build
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from datetime import datetime, timezone
import praw
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import time

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

def get_trending_hashtags(max_results=200):
    request = YOUTUBE.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode="IN",
        maxResults=max_results,
        fields="items(snippet(title,description,publishedAt,tags),statistics/viewCount)"
    )
    response = request.execute()

    hashtag_metrics = defaultdict(lambda: {'count': 0, 'video_count': 0, 'view_counts': [], 'virality': []})
    
    now = datetime.now(timezone.utc).timestamp()

    for item in response['items']:
        snippet = item['snippet']
        stats = item['statistics']

        title = snippet['title'].lower()
        description = snippet['description'].lower()
        text = f"{title} {description}"
        video_views = int(stats.get('viewCount', 0))

        # Parse published time
        published_at = datetime.strptime(snippet['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
        published_timestamp = published_at.replace(tzinfo=timezone.utc).timestamp()
        burst_time = now - published_timestamp
        views_per_sec = video_views / burst_time if burst_time > 0 else video_views

        hashtags = set(re.findall(r"#([^\s!@#$%^&*(),.?\":{}|<>]+)", text))
        
        for hashtag in hashtags:
            hashtag_metrics[hashtag]['count'] += 1
            hashtag_metrics[hashtag]['video_count'] += 1
            hashtag_metrics[hashtag]['view_counts'].append(video_views)
            hashtag_metrics[hashtag]['virality'].append({
                "published": int(published_timestamp * 1000),  # ms for chart
                "views": video_views,
                "views_per_sec": views_per_sec
            })

    hashtag_data = []
    for hashtag, data in hashtag_metrics.items():
        avg_views = sum(data['view_counts']) / len(data['view_counts']) if data['view_counts'] else 0
        score = (data['video_count'] * avg_views) / (data['count'] or 1)

        hashtag_data.append({
            "hashtag": f"#{hashtag}",
            "score": round(score, 2),
            "virality": data['virality']
        })

    return sorted(hashtag_data, key=lambda x: x['score'], reverse=True)[:10]

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

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

@app.route('/reddit-posts')
def get_dashboard_data():
    try:
        subreddit_name = "technology"
        subreddit = reddit.subreddit(subreddit_name)
        posts = list(subreddit.hot(limit=10))

        now = int(time.time())

        trends = []
        virality = []

        for post in posts:
            created_time = int(post.created_utc)
            burst_time = now - created_time
            mentions = post.score

            trends.append({
                "name": post.title[:80] + ("..." if len(post.title) > 80 else ""),
                "count": mentions
            })

            virality.append({
                "topic": post.title[:50],
                "startTime": created_time * 1000,  # ms for chart
                "rate": mentions / burst_time if burst_time > 0 else mentions,
                "mentions": mentions
            })

        # Sentiment from comments
        reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
        sentiment_raw = reddit_sentiment["sentiment_distribution"]
        total = sum(sentiment_raw.values()) or 1

        sentiment = [
            {"name": "positive", "value": round(sentiment_raw["positive"] * 100 / total), "color": "#00FF00"},
            {"name": "neutral", "value": round(sentiment_raw["neutral"] * 100 / total), "color": "#FFFF00"},
            {"name": "negative", "value": round(sentiment_raw["negative"] * 100 / total), "color": "#FF0000"}
        ]

        # Dummy timeline (can be customized further)
        timeline = [
            {"date": "2025-01-01", "mentions": 1200},
            {"date": "2025-02-01", "mentions": 2300},
            {"date": "2025-03-01", "mentions": 3100}
        ]

        return jsonify({
            "trends": trends,
            "sentiment": sentiment,
            "timeline": timeline,
            "virality": virality
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    
@app.route('/report', methods=['GET'])
def get_combined_report():
    try:
        # Get dashboard data (Reddit)
        subreddit_name = "technology"
        reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
        sentiment_raw = reddit_sentiment["sentiment_distribution"]
        total_sentiments = sum(sentiment_raw.values()) or 1

        sentiment_summary = {
            "positive_percent": round(sentiment_raw["positive"] * 100 / total_sentiments),
            "neutral_percent": round(sentiment_raw["neutral"] * 100 / total_sentiments),
            "negative_percent": round(sentiment_raw["negative"] * 100 / total_sentiments)
        }

        # Get trending hashtags (YouTube)
        trending_hashtags = get_trending_hashtags()

        # Predict future virality (very basic)
        predicted_mentions = [
            {"month": "2025-04", "mentions": 3400},
            {"month": "2025-05", "mentions": 4100},
            {"month": "2025-06", "mentions": 4700}
        ]

        return jsonify({
            "summary": {
                "total_analyzed_posts": reddit_sentiment["total_posts"],
                "sentiment_distribution": sentiment_summary,
                "top_hashtags": trending_hashtags[:5]
            },
            "predictions": predicted_mentions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_trending_hashtags', methods=['GET'])
def get_trending_hashtags_route():
    try:
        trending_hashtags = get_trending_hashtags()
        return jsonify({
            "hashtags": trending_hashtags
        })
    except Exception as e:
        print("🔥 Error in /get_trending_hashtags:", e)
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
