import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')

class TextProcessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        self.min_word_length = 3

    def clean_text(self, text):
        if not text or text == "[removed]" or text == "[deleted]":
            return "no_content"
            
        # Remove URLs, special chars, but keep basic punctuation
        text = re.sub(r'http\S+', '', text)
        text = re.sub(r'[^a-zA-Z\s\.,!?]', '', text)
        text = text.lower()
        
        words = text.split()
        processed_words = []
        
        for word in words:
            if (word not in self.stop_words and 
                len(word) >= self.min_word_length):
                lemma = self.lemmatizer.lemmatize(word)
                processed_words.append(lemma)
        
        return ' '.join(processed_words) if processed_words else "no_content"