import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load the dataset
df = pd.read_csv('https://www.kaggle.com/datasets/modhiibrahimalmannaa/1000-children-books-on-amazom')

# Preprocess the data
tfidf = TfidfVectorizer(stop_words='english')
df['tags'] = df['tags'].fillna('')
tfidf_matrix = tfidf.fit_transform(df['tags'])

# Compute the cosine similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Function to get recommendations
def get_recommendations(title, cosine_sim=cosine_sim):
    idx = df.index[df['title'] == title].tolist()[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]
    book_indices = [i[0] for i in sim_scores]
    return df['title'].iloc[book_indices].tolist()

# Get the title from the input data
input_data = json.loads(sys.argv[1])
title = input_data['title']

# Get recommendations
recommendations = get_recommendations(title)

# Output the recommendations as JSON
print(json.dumps(recommendations))