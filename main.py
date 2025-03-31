from utils.streamer import RedditStreamer
from utils.processor import TextProcessor
from utils.analyzer import TrendAnalyzer
import pandas as pd
from datetime import datetime

def main():
    try:
        # Configuration
        subreddit = "technology"  # or "all" for all subreddits
        limit = 100
        
        # Collect posts
        streamer = RedditStreamer()
        raw_posts = streamer.get_hot_posts(subreddit=subreddit, limit=limit)
        
        if not raw_posts:
            print("No posts collected. Check API access or try different subreddit.")
            return
            
        # Preprocess data - combine title and text
        processor = TextProcessor()
        processed_texts = []
        for post in raw_posts:
            combined_text = f"{post['title']}. {post['text']}"
            cleaned = processor.clean_text(combined_text)
            if cleaned != "no_content":
                processed_texts.append(cleaned)
        
        if not processed_texts:
            print("No valid text content after preprocessing.")
            return
            
        # Analyze trends
        analyzer = TrendAnalyzer(num_clusters=5, num_topics=3)
        vectors = analyzer.vectorize_text(processed_texts)
        clusters = analyzer.cluster_texts(vectors)
        topics = analyzer.detect_topics(processed_texts)
        
        # Create DataFrame
        df = pd.DataFrame(raw_posts)
        df = df[df.index.isin(range(len(clusters)))]  # Ensure alignment
        df['cluster'] = clusters
        df['created_at'] = df['created_utc'].apply(lambda x: datetime.fromtimestamp(x))
        
        # Display results
        print("\nDetected Topics:")
        for topic in topics:
            print(topic)
            
        print("\nCluster Distribution:")
        print(df['cluster'].value_counts())
        
        # Save results
        df.to_csv(f"reddit_{subreddit}_trends.csv", index=False)
        print(f"\nResults saved to reddit_{subreddit}_trends.csv")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()