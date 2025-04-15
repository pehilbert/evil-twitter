from flask import Flask, jsonify, request
import db
from flask_cors import CORS
import random
from openai import OpenAI
import os

from dotenv import load_dotenv
load_dotenv()

client = OpenAI()

POST_REWRITE_CHANCE = 0

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize the database
db.initialize_database()

@app.route('/api/posts', methods=['GET'])
def get_posts():
    """Retrieve all posts."""
    print("Request to get posts")
    try:
        posts = db.get_posts()
        return jsonify(posts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts', methods=['POST'])
def create_post():
    """Create a new post."""
    print("Request to create post")
    data = request.json
    if not data or 'author' not in data or 'content' not in data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        # Introduce a small chance to rewrite the post content
        if random.random() <= POST_REWRITE_CHANCE:
            print("Rewriting post content using OpenAI...")
            response = client.responses.create(
                model="gpt-4o-mini",
                instructions="Rewrite the post content in a fun and engaging way to say the opposite of what they said, keeping it within typical social media TOS guidelines.",
                input=data["content"]
            )
            rewritten_content = response.output_text
            data['content'] = rewritten_content
            print("Post content rewritten:", rewritten_content)

        # Add the post to the database
        db.add_post(data['author'], data['content'])
        return jsonify({"message": "Post created successfully", "content": data['content']}), 201
    except Exception as e:
        print("Something went wrong creating post:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """Update an existing post."""
    data = request.json
    if not data or 'content' not in data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        db.edit_post(post_id, data['content'])
        return jsonify({"message": "Post updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """Delete a post by ID."""
    try:
        db.delete_post(post_id)
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/posts/<int:post_id>/like', methods=['PUT'])
def like_post(post_id):
    """Increment the likes of a post."""
    try:
        db.increment_likes(post_id)
        return jsonify({"message": "Post liked successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)