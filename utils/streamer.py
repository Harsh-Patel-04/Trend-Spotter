import praw
from config.api_config import CLIENT_ID, CLIENT_SECRET, USER_AGENT

class RedditStreamer:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            user_agent=USER_AGENT,
        )

    def get_hot_posts(self, subreddit="all", limit=100):
        subreddit = self.reddit.subreddit(subreddit)
        posts = []
        
        for post in subreddit.hot(limit=limit):
            posts.append({
                'id': post.id,
                'title': post.title,
                'text': post.selftext,
                'created_utc': post.created_utc,
                'upvotes': post.score,
                'comments': post.num_comments,
                'url': post.url
            })
        
        return posts

    def search_posts(self, query, limit=100):
        posts = []
        for post in self.reddit.subreddit("all").search(query, limit=limit):
            posts.append({
                'id': post.id,
                'title': post.title,
                'text': post.selftext,
                'created_utc': post.created_utc
            })
        return posts