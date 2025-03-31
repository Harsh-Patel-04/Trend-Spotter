from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

class TrendAnalyzer:
    def __init__(self, num_clusters=5, num_topics=3):
        self.num_clusters = num_clusters
        self.num_topics = num_topics
        
    def vectorize_text(self, texts):
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000)
        return self.tfidf_vectorizer.fit_transform(texts)
    
    def cluster_texts(self, vectors):
        kmeans = KMeans(n_clusters=self.num_clusters)
        clusters = kmeans.fit_predict(vectors)
        return clusters
    
    def detect_topics(self, texts):
        count_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=1000)
        dtm = count_vectorizer.fit_transform(texts)
        
        lda = LatentDirichletAllocation(n_components=self.num_topics)
        lda.fit(dtm)
        
        feature_names = count_vectorizer.get_feature_names_out()
        topics = []
        for topic_idx, topic in enumerate(lda.components_):
            top_words = [feature_names[i] for i in topic.argsort()[:-10 - 1:-1]]
            topics.append(f"Topic {topic_idx+1}: {', '.join(top_words)}")
        
        return topics