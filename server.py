from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import praw
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# 1. Initialize NLTK first
nltk.download('vader_lexicon')  # Add this right after imports

# 2. Configure Reddit API client
reddit = praw.Reddit(
    client_id="hLsCHjkFXtuT-1ceGi9Fig",
    client_secret="KXAuafreQ8AzNTO3au3WjHT7S1igmg",
    user_agent="trend_spotter"
)

# 3. Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

app = Flask(__name__)
CORS(app, resources={
    r"/analyze_sentiment": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    },
    r"/dashboard": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET"]
    }
})

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

# 4. Add the analysis function HERE (before the routes)
def analyze_comments_sentiment(subreddit_name, post_limit=5, comment_limit=None):
    """Analyze sentiment of comments in a subreddit"""
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
        # If comment_limit is None, analyze all comments; otherwise, slice to comment_limit
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

# 5. Then add your routes
@app.route('/analyze_sentiment', methods=['POST', 'OPTIONS'])
def analyze_sentiment():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        subreddit_name = data.get('subreddit', 'technology')
        post_limit = data.get('limit', 5)
        
        # Call function without comment_limit to analyze all comments
        results = analyze_comments_sentiment(subreddit_name, post_limit)
        
        response = jsonify(results)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response
        
    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return error_response, 500

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
