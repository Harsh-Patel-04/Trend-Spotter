# import os
# import re
# import time
# import math
# from collections import defaultdict
# from datetime import datetime, timezone
# from googleapiclient.discovery import build
# from flask import Flask, jsonify, request, make_response
# from flask_cors import CORS
# import praw
# import nltk
# from nltk.sentiment.vader import SentimentIntensityAnalyzer

# # Ensure NLTK data is downloaded
# try:
#     nltk.data.find('sentiment/vader_lexicon.zip')
# except LookupError:
#     nltk.download('vader_lexicon')

# # Configure Reddit API client
# reddit = praw.Reddit(
#     client_id="hLsCHjkFXtuT-1ceGi9Fig",
#     client_secret="KXAuafreQ8AzNTO3au3WjHT7S1igmg",
#     user_agent="trend_spotter"
# )

# # Initialize sentiment analyzer
# analyzer = SentimentIntensityAnalyzer()

# # YouTube API setup
# API_KEY = "AIzaSyB80xRZ6HWWcXXG5H4fxJp_dEAliEL-TPM"
# YOUTUBE = build('youtube', 'v3', developerKey=API_KEY)

# app = Flask(__name__)
# CORS(app)

# ### ---------------------------
# ### YouTube Endpoints
# ### ---------------------------

# # Endpoint: Get Trending Videos
# @app.route('/get_trending_videos', methods=['GET'])
# def get_trending_videos_route():
#     # Extract region from query parameters; default to "IN" if not provided
#     region = request.args.get('region', 'IN')
#     try:
#         trending_videos = get_trending_videos(region=region)
#         return jsonify({"videos": trending_videos})
#     except Exception as e:
#         print("Error in /get_trending_videos:", e)
#         return jsonify({"error": str(e)}), 500

# def get_trending_videos(max_results=10, region="IN"):
#     request_obj = YOUTUBE.videos().list(
#         part="snippet,statistics",
#         chart="mostPopular",
#         regionCode=region,  # Using dynamic region parameter
#         maxResults=max_results,
#         fields="items(id,snippet(title,publishedAt),statistics(viewCount))"
#     )
#     response = request_obj.execute()
#     trending = []
#     for item in response.get('items', []):
#         trending.append({
#             "id": item.get("id"),
#             "title": item.get("snippet", {}).get("title"),
#             "publishedAt": item.get("snippet", {}).get("publishedAt"),
#             "viewCount": item.get("statistics", {}).get("viewCount")
#         })
#     return trending

# # Endpoint: Video Analysis (YouTube)
# @app.route('/video_analysis', methods=['GET'])
# def video_analysis():
#     video_id = request.args.get('video_id')
#     duration = request.args.get('duration', 'week')  # Default to 'week'

#     if not video_id:
#         return jsonify({'error': 'video_id is required'}), 400

#     # Fetch video details via YouTube API
#     video_request = YOUTUBE.videos().list(
#         part="snippet,statistics",
#         id=video_id
#     )
#     video_response = video_request.execute()
#     if not video_response.get('items'):
#         return jsonify({'error': 'Video not found'}), 404

#     video_item = video_response['items'][0]
#     snippet = video_item.get('snippet', {})
#     statistics = video_item.get('statistics', {})

#     title = snippet.get('title')
#     description = snippet.get('description')
#     published_at = snippet.get('publishedAt')
#     view_count = int(statistics.get('viewCount', 0))
#     like_count = int(statistics.get('likeCount', 0)) if 'likeCount' in statistics else 0
#     comment_count = int(statistics.get('commentCount', 0)) if 'commentCount' in statistics else 0

#     # --- Dummy Analytics Calculations ---
#     impressions = view_count * 10
#     ctr = round((view_count / impressions) * 100, 2) if impressions > 0 else 0

#     # Dummy viewer sources percentages
#     viewer_sources = {
#         "YouTube Search": "40%",
#         "Suggested Videos": "35%",
#         "External": "15%",
#         "Direct/Other": "10%"
#     }

#     # Dummy content suggestions & search terms (static; remove if not needed)
#     content_suggestions = ["Video A", "Video B", "Video C"]
#     youtube_search_terms = ["term1", "term2", "term3"]
#     average_view_duration = "05:30"
#     watch_time = f"{round(view_count * 5/60, 2)} hours"
#     audience = {
#         "Male": "55%",
#         "Female": "45%",
#         "Age 18-24": "30%",
#         "Age 25-34": "40%",
#         "Age 35+": "30%"
#     }

#     # --- Dummy Sentiment Analysis ---
#     sentiment_analysis = {
#         "positive": 60,
#         "neutral": 25,
#         "negative": 15
#     }

#     # --- Future Predictions based on duration ---
#     future_prediction = []
#     if duration == 'week':
#         for day in range(1, 8):
#             future_prediction.append({
#                 "timeframe": f"Day {day}",
#                 "predicted_views": view_count + day * 500  # Dummy incremental logic
#             })
#     elif duration == 'month':
#         for week in range(1, 5):
#             future_prediction.append({
#                 "timeframe": f"Week {week}",
#                 "predicted_views": view_count + week * 2500  # Dummy incremental logic
#             })
#     else:
#         future_prediction = [{"timeframe": "N/A", "predicted_views": view_count}]

#     # --- Get Top Comments ---
#     top_comments = []
#     try:
#         comments_request = YOUTUBE.commentThreads().list(
#             part="snippet",
#             videoId=video_id,
#             maxResults=50,
#             textFormat="plainText"
#         )
#         comments_response = comments_request.execute()
#         comments_list = []
#         for item in comments_response.get("items", []):
#             comment_snippet = item["snippet"]["topLevelComment"]["snippet"]
#             comments_list.append({
#                 "author": comment_snippet.get("authorDisplayName"),
#                 "text": comment_snippet.get("textDisplay"),
#                 "likes": comment_snippet.get("likeCount", 0)
#             })
#         top_comments = sorted(comments_list, key=lambda x: x["likes"], reverse=True)[:10]
#     except Exception as e:
#         print("Error fetching comments:", e)
#         # Use empty array if error occurs

#     analysis_data = {
#         "video_id": video_id,
#         "title": title,
#         "description": description,
#         "publishedAt": published_at,
#         "viewCount": view_count,
#         "likeCount": like_count,
#         "commentCount": comment_count,
#         "analytics": {
#             "impressions": impressions,
#             "ctr": ctr,
#             "viewer_sources": viewer_sources,
#             "content_suggestions": content_suggestions,
#             "youtube_search_terms": youtube_search_terms,
#             "average_view_duration": average_view_duration,
#             "watch_time": watch_time,
#             "audience": audience
#         },
#         "analysis": {
#             "click_ratio": round(ctr, 2),
#             "sentiment_analysis": sentiment_analysis,
#             "future_prediction": future_prediction
#         },
#         "top_comments": top_comments
#     }
#     return jsonify(analysis_data)

# ### ---------------------------
# ### Reddit / Report Endpoints
# ### ---------------------------

# def get_trending_hashtags(max_results=200):
#     request_obj = YOUTUBE.videos().list(
#         part="snippet,statistics",
#         chart="mostPopular",
#         regionCode="IN",
#         maxResults=max_results,
#         fields="items(snippet(title,description,publishedAt,tags),statistics/viewCount)"
#     )
#     response = request_obj.execute()
#     hashtag_metrics = defaultdict(lambda: {'count': 0, 'video_count': 0, 'view_counts': [], 'virality': []})
#     now = datetime.now(timezone.utc).timestamp()

#     for item in response['items']:
#         snippet = item['snippet']
#         stats = item['statistics']
#         title = snippet['title'].lower()
#         description = snippet['description'].lower()
#         text = f"{title} {description}"
#         video_views = int(stats.get('viewCount', 0))
#         published_at = datetime.strptime(snippet['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
#         published_timestamp = published_at.replace(tzinfo=timezone.utc).timestamp()
#         burst_time = now - published_timestamp
#         views_per_sec = video_views / burst_time if burst_time > 0 else video_views
#         hashtags = set(re.findall(r"#([^\s!@#$%^&*(),.?\":{}|<>]+)", text))
        
#         for hashtag in hashtags:
#             hashtag_metrics[hashtag]['count'] += 1
#             hashtag_metrics[hashtag]['video_count'] += 1
#             hashtag_metrics[hashtag]['view_counts'].append(video_views)
#             hashtag_metrics[hashtag]['virality'].append({
#                 "published": int(published_timestamp * 1000),
#                 "views": video_views,
#                 "views_per_sec": views_per_sec
#             })

#     hashtag_data = []
#     for hashtag, data in hashtag_metrics.items():
#         avg_views = sum(data['view_counts']) / len(data['view_counts']) if data['view_counts'] else 0
#         score = (data['video_count'] * avg_views) / (data['count'] or 1)
#         hashtag_data.append({
#             "hashtag": f"#{hashtag}",
#             "score": round(score, 2),
#             "virality": data['virality']
#         })

#     return sorted(hashtag_data, key=lambda x: x['score'], reverse=True)[:10]

# def _build_cors_preflight_response():
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#     response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type")
#     return response

# def analyze_comments_sentiment(subreddit_name, post_limit=5, comment_limit=None):
#     subreddit = reddit.subreddit(subreddit_name)
#     posts = subreddit.hot(limit=post_limit)
#     sentiments = {"positive": 0, "neutral": 0, "negative": 0}
#     analyzed_posts = []

#     for post in posts:
#         post_data = {
#             "title": post.title,
#             "url": post.url,
#             "comments": []
#         }
#         post.comments.replace_more(limit=0)
#         all_comments = post.comments.list()
#         comments = all_comments if comment_limit is None else all_comments[:comment_limit]
#         for comment in comments:
#             text = comment.body
#             score = analyzer.polarity_scores(text)['compound']
#             sentiment = "neutral"
#             if score >= 0.05:
#                 sentiment = "positive"
#                 sentiments["positive"] += 1
#             elif score <= -0.05:
#                 sentiment = "negative"
#                 sentiments["negative"] += 1
#             else:
#                 sentiments["neutral"] += 1
#             post_data["comments"].append({
#                 "text": text,
#                 "sentiment": sentiment,
#                 "score": score
#             })
#         analyzed_posts.append(post_data)
#     return {
#         "subreddit": subreddit_name,
#         "total_posts": len(analyzed_posts),
#         "sentiment_distribution": sentiments,
#         "posts": analyzed_posts
#     }

# @app.route('/reddit-posts')
# def get_dashboard_data():
#     try:
#         subreddit_name = "technology"
#         subreddit = reddit.subreddit(subreddit_name)
#         posts = list(subreddit.hot(limit=10))
#         now = int(time.time())
#         trends = []
#         virality = []

#         for post in posts:
#             created_time = int(post.created_utc)
#             burst_time = now - created_time
#             mentions = post.score

#             trends.append({
#                 "name": post.title[:80] + ("..." if len(post.title) > 80 else ""),
#                 "count": mentions
#             })

#             virality.append({
#                 "topic": post.title[:50],
#                 "startTime": created_time * 1000,
#                 "rate": mentions / burst_time if burst_time > 0 else mentions,
#                 "mentions": mentions
#             })

#         reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
#         sentiment_raw = reddit_sentiment["sentiment_distribution"]
#         total = sum(sentiment_raw.values()) or 1

#         sentiment = [
#             {"name": "positive", "value": round(sentiment_raw["positive"] * 100 / total), "color": "#00FF00"},
#             {"name": "neutral", "value": round(sentiment_raw["neutral"] * 100 / total), "color": "#FFFF00"},
#             {"name": "negative", "value": round(sentiment_raw["negative"] * 100 / total), "color": "#FF0000"}
#         ]

#         timeline = [
#             {"date": "2025-01-01", "mentions": 1200},
#             {"date": "2025-02-01", "mentions": 2300},
#             {"date": "2025-03-01", "mentions": 3100}
#         ]
#         return jsonify({
#             "trends": trends,
#             "sentiment": sentiment,
#             "timeline": timeline,
#             "virality": virality
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/analyze_sentiment', methods=['POST', 'OPTIONS'])
# def analyze_sentiment():
#     if request.method == 'OPTIONS':
#         return _build_cors_preflight_response()
#     try:
#         data = request.get_json()
#         subreddit_name = data.get('subreddit', 'technology')
#         post_limit = data.get('limit', 5)
#         results = analyze_comments_sentiment(subreddit_name, post_limit)
#         response = jsonify(results)
#         response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#         return response
#     except Exception as e:
#         error_response = jsonify({"error": str(e)})
#         error_response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#         return error_response, 500

# @app.route('/report', methods=['GET'])
# def get_combined_report():
#     try:
#         subreddit_name = "technology"
#         reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
#         sentiment_raw = reddit_sentiment["sentiment_distribution"]
#         total_sentiments = sum(sentiment_raw.values()) or 1

#         sentiment_summary = {
#             "positive_percent": round(sentiment_raw["positive"] * 100 / total_sentiments),
#             "neutral_percent": round(sentiment_raw["neutral"] * 100 / total_sentiments),
#             "negative_percent": round(sentiment_raw["negative"] * 100 / total_sentiments)
#         }

#         trending_hashtags = get_trending_hashtags()
#         predicted_mentions = [
#             {"month": "2025-04", "mentions": 3400},
#             {"month": "2025-05", "mentions": 4100},
#             {"month": "2025-06", "mentions": 4700}
#         ]
#         return jsonify({
#             "summary": {
#                 "total_analyzed_posts": reddit_sentiment["total_posts"],
#                 "sentiment_distribution": sentiment_summary,
#                 "top_hashtags": trending_hashtags[:5]
#             },
#             "predictions": predicted_mentions
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/get_trending_hashtags', methods=['GET'])
# def get_trending_hashtags_route():
#     try:
#         trending_hashtags = get_trending_hashtags()
#         return jsonify({"hashtags": trending_hashtags})
#     except Exception as e:
#         print("🔥 Error in /get_trending_hashtags:", e)
#         return jsonify({"error": str(e)}), 500

# ### ---------------------------
# ### Error Handlers
# ### ---------------------------
# @app.errorhandler(500)
# def handle_500(error):
#     response = jsonify({"error": "Internal server error"})
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#     return response, 500

# @app.errorhandler(404)
# def handle_404(error):
#     response = jsonify({"error": "Resource not found"})
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#     return response, 404

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

import os
import re
import time
import math
from collections import defaultdict
from datetime import datetime, timezone
from googleapiclient.discovery import build
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import praw
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd
from collections import defaultdict
# Ensure NLTK data is downloaded
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
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

# Endpoint: Get Trending Videos
@app.route('/get_trending_videos', methods=['GET'])
def get_trending_videos_route():
    # Extract region from query parameters; default to "IN" if not provided
    region = request.args.get('region', 'IN')
    try:
        trending_videos = get_trending_videos(region=region)
        return jsonify({"videos": trending_videos})
    except Exception as e:
        print("Error in /get_trending_videos:", e)
        return jsonify({"error": str(e)}), 500

def get_trending_videos(max_results=10, region="IN"):
    request_obj = YOUTUBE.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode=region,  # Using dynamic region parameter
        maxResults=max_results,
        fields="items(id,snippet(title,publishedAt),statistics(viewCount))"
    )
    response = request_obj.execute()
    trending = []
    for item in response.get('items', []):
        trending.append({
            "id": item.get("id"),
            "title": item.get("snippet", {}).get("title"),
            "publishedAt": item.get("snippet", {}).get("publishedAt"),
            "viewCount": item.get("statistics", {}).get("viewCount")
        })
    return trending

@app.route('/api/analyze/<path:region>', methods=['GET'])
def analyze_region(region):
    try:
        # Get parameters with defaults
        days = int(request.args.get('days', 7))
        limit = int(request.args.get('limit', 200))
        
        # Fetch subreddit data
        subreddit = reddit.subreddit(region)
        posts = []
        
        # Collect posts with error handling
        try:
            for post in subreddit.hot(limit=limit):
                posts.append({
                    'title': post.title,
                    'created_utc': post.created_utc,
                    'score': post.score,
                    'num_comments': post.num_comments
                })
        except Exception as e:
            return jsonify({'error': f'Reddit API error: {str(e)}'}), 500

        if not posts:
            return jsonify({'error': 'No posts found in this subreddit'}), 404

        # Process posts for trends
        df = pd.DataFrame(posts)
        df['created'] = pd.to_datetime(df['created_utc'], unit='s')
        
        # Clean titles and count words
        custom_stopwords = {
            'the', 'this', 'that', 'with', 'have', 'just', 'your', 'from', 'they',
            'what', 'would', 'like', 'there', 'will', 'could', 'should', 'about'
        }
        
        word_counts = defaultdict(int)
        for title in df['title']:
            cleaned = re.sub(r'[^\w\s]', '', title.lower())
            tokens = [word for word in re.findall(r'\b\w+\b', cleaned) 
                     if word not in custom_stopwords and len(word) > 3]
            for word in tokens:
                word_counts[word] += 1

        # Get top 5 trends
        trending = sorted(
            [(word, count) for word, count in word_counts.items() if count > 1],
            key=lambda x: x[1],
            reverse=True
        )[:5]

        if not trending:
            return jsonify({'error': 'No significant trends found'}), 404

        # Sentiment analysis for top trend
        top_trend = trending[0][0]
        trend_posts = df[df['title'].str.contains(top_trend, case=False)]
        sentiment_scores = []
        
        for title in trend_posts['title']:
            sentiment = analyzer.polarity_scores(title)
            sentiment_scores.append(sentiment['compound'])

        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

        # Engagement calculation
        avg_comments = df['num_comments'].mean()
        engagement_score = min(100, (avg_comments / 50) * 100)  # Scale based on comments

        # Bot likelihood heuristic (simplified example)
        time_diff = df['created'].max() - df['created'].min()
        posts_per_hour = len(df) / (time_diff.total_seconds() / 3600)
        bot_likelihood = min(100, posts_per_hour * 0.5)  # 2 posts/hour = 1% likelihood

        return jsonify({
            'trends': [{
                'keyword': word,
                'count': count,
                'sentiment': analyzer.polarity_scores(word)['compound']
            } for word, count in trending],
            'validation': {
                'engagement': round(engagement_score, 1),
                'bot_likelihood': round(bot_likelihood, 1),
                'avg_sentiment': round(avg_sentiment, 2)
            }
        })

    except Exception as e:
        app.logger.error(f"Error in analyze_region: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
# Endpoint: Video Analysis (YouTube)
@app.route('/video_analysis', methods=['GET'])
def video_analysis():
    video_id = request.args.get('video_id')
    duration = request.args.get('duration', 'week')  # Default to 'week'

    if not video_id:
        return jsonify({'error': 'video_id is required'}), 400

    # Fetch video details via YouTube API
    video_request = YOUTUBE.videos().list(
        part="snippet,statistics",
        id=video_id
    )
    video_response = video_request.execute()
    if not video_response.get('items'):
        return jsonify({'error': 'Video not found'}), 404

    video_item = video_response['items'][0]
    snippet = video_item.get('snippet', {})
    statistics = video_item.get('statistics', {})

    title = snippet.get('title')
    description = snippet.get('description')
    published_at = snippet.get('publishedAt')
    view_count = int(statistics.get('viewCount', 0))
    like_count = int(statistics.get('likeCount', 0)) if 'likeCount' in statistics else 0
    comment_count = int(statistics.get('commentCount', 0)) if 'commentCount' in statistics else 0

    # --- Dummy Analytics Calculations ---
    impressions = view_count * 10
    ctr = round((view_count / impressions) * 100, 2) if impressions > 0 else 0

    # Dummy viewer sources percentages
    viewer_sources = {
        "YouTube Search": "40%",
        "Suggested Videos": "35%",
        "External": "15%",
        "Direct/Other": "10%"
    }

    # Dummy content suggestions & search terms (static; remove if not needed)
    content_suggestions = ["Video A", "Video B", "Video C"]
    youtube_search_terms = ["term1", "term2", "term3"]
    average_view_duration = "05:30"
    watch_time = f"{round(view_count * 5/60, 2)} hours"
    audience = {
        "Male": "55%",
        "Female": "45%",
        "Age 18-24": "30%",
        "Age 25-34": "40%",
        "Age 35+": "30%"
    }

    # --- Dummy Sentiment Analysis ---
    sentiment_analysis = {
        "positive": 60,
        "neutral": 25,
        "negative": 15
    }

    # --- Future Predictions based on duration ---
    future_prediction = []
    if duration == 'week':
        for day in range(1, 8):
            future_prediction.append({
                "timeframe": f"Day {day}",
                "predicted_views": view_count + day * 500  # Dummy incremental logic
            })
    elif duration == 'month':
        for week in range(1, 5):
            future_prediction.append({
                "timeframe": f"Week {week}",
                "predicted_views": view_count + week * 2500  # Dummy incremental logic
            })
    else:
        future_prediction = [{"timeframe": "N/A", "predicted_views": view_count}]

    # --- Get Top Comments ---
    top_comments = []
    try:
        comments_request = YOUTUBE.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=50,
            textFormat="plainText"
        )
        comments_response = comments_request.execute()
        comments_list = []
        for item in comments_response.get("items", []):
            comment_snippet = item["snippet"]["topLevelComment"]["snippet"]
            comments_list.append({
                "author": comment_snippet.get("authorDisplayName"),
                "text": comment_snippet.get("textDisplay"),
                "likes": comment_snippet.get("likeCount", 0)
            })
        top_comments = sorted(comments_list, key=lambda x: x["likes"], reverse=True)[:10]
    except Exception as e:
        print("Error fetching comments:", e)
        # Use empty array if error occurs

    analysis_data = {
        "video_id": video_id,
        "title": title,
        "description": description,
        "publishedAt": published_at,
        "viewCount": view_count,
        "likeCount": like_count,
        "commentCount": comment_count,
        "analytics": {
            "impressions": impressions,
            "ctr": ctr,
            "viewer_sources": viewer_sources,
            "content_suggestions": content_suggestions,
            "youtube_search_terms": youtube_search_terms,
            "average_view_duration": average_view_duration,
            "watch_time": watch_time,
            "audience": audience
        },
        "analysis": {
            "click_ratio": round(ctr, 2),
            "sentiment_analysis": sentiment_analysis,
            "future_prediction": future_prediction
        },
        "top_comments": top_comments
    }
    return jsonify(analysis_data)

def get_trending_hashtags(max_results=200):
    request_obj = YOUTUBE.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode="IN",
        maxResults=max_results,
        fields="items(snippet(title,description,publishedAt,tags),statistics/viewCount)"
    )
    response = request_obj.execute()
    hashtag_metrics = defaultdict(lambda: {'count': 0, 'video_count': 0, 'view_counts': [], 'virality': []})
    now = datetime.now(timezone.utc).timestamp()

    for item in response['items']:
        snippet = item['snippet']
        stats = item['statistics']
        title = snippet['title'].lower()
        description = snippet['description'].lower()
        text = f"{title} {description}"
        video_views = int(stats.get('viewCount', 0))
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
                "published": int(published_timestamp * 1000),
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
                "startTime": created_time * 1000,
                "rate": mentions / burst_time if burst_time > 0 else mentions,
                "mentions": mentions
            })

        reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
        sentiment_raw = reddit_sentiment["sentiment_distribution"]
        total = sum(sentiment_raw.values()) or 1

        sentiment = [
            {"name": "positive", "value": round(sentiment_raw["positive"] * 100 / total), "color": "#00FF00"},
            {"name": "neutral", "value": round(sentiment_raw["neutral"] * 100 / total), "color": "#FFFF00"},
            {"name": "negative", "value": round(sentiment_raw["negative"] * 100 / total), "color": "#FF0000"}
        ]

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
        subreddit_name = "technology"
        reddit_sentiment = analyze_comments_sentiment(subreddit_name, post_limit=5)
        sentiment_raw = reddit_sentiment["sentiment_distribution"]
        total_sentiments = sum(sentiment_raw.values()) or 1

        sentiment_summary = {
            "positive_percent": round(sentiment_raw["positive"] * 100 / total_sentiments),
            "neutral_percent": round(sentiment_raw["neutral"] * 100 / total_sentiments),
            "negative_percent": round(sentiment_raw["negative"] * 100 / total_sentiments)
        }

        trending_hashtags = get_trending_hashtags()
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
        return jsonify({"hashtags": trending_hashtags})
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
