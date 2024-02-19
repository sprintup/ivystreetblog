import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords', quiet=True)

# Path to the CSV file
file_path = 'books_data.csv'  # Assuming the file is in the current directory

# Load the data
data = pd.read_csv(file_path)

# Preprocessing the text data
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove special characters
    text = re.sub(r'\W', ' ', text)
    # Remove all single characters
    text = re.sub(r'\s+[a-zA-Z]\s+', ' ', text)
    # Substituting multiple spaces with single space
    text = re.sub(r'\s+', ' ', text, flags=re.I)
    # Removing stopwords
    stop_words = set(stopwords.words('english'))
    words = text.split()
    text = ' '.join([word for word in words if word not in stop_words])
    return text

# Apply preprocessing to the Description column
data['Cleaned_Description'] = data['Description'].astype(str).apply(preprocess_text)

# Initialize TF-IDF Vectorizer
tfidf = TfidfVectorizer(max_features=5000)
tfidf_matrix = tfidf.fit_transform(data['Cleaned_Description'])

# Compute the cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Function to get recommendations
def get_recommendations(book_title, cosine_sim=cosine_sim):
    # Get the index of the book that matches the title
    idx = data.index[data['Name'] == book_title].tolist()[0]

    # Get the pairwise similarity scores of all books with that book
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the books based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar books
    sim_scores = sim_scores[1:6]

    # Get the book indices
    book_indices = [i[0] for i in sim_scores]

    # Return the top 5 most similar books
    return data['Name'].iloc[book_indices]

# Example usage
book_title = 'We Were Liars'  # Replace this with a book title from your dataset
recommended_books = get_recommendations(book_title)
print(f"Books recommended based on '{book_title}':\n")
print(recommended_books)
