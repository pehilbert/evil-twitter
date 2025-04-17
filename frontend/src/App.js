import React, { useState, useEffect } from 'react';
import Feed from './components/Feed';

function App() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch posts from the backend
    useEffect(() => {
        fetchPosts();
    }, []);

    // Add a new post to the backend
    const addPost = async (author, content) => {
        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            // Update UI
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Edit an existing post
    const editPost = async (postId, newContent) => {
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            // Update the post in the UI
            setPosts(posts.map(post => (post.id === postId ? { ...post, content: newContent } : post)));
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Like a post
    const likePost = async (postId) => {
        try {
            // Send request asynchronously to avoid delay in UI update
            fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: 'PUT'
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to like post');
                }
            });

            // Update the likes count in the UI
            setPosts(posts.map(post => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Add a new reply to a post
    const addReply = async (postId, author, content) => {
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to add reply');
            }

            // Fetch posts again to update replies
            fetchPosts();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    // Fetch replies for a specific post
    const fetchReplies = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/replies`);
            if (!response.ok) {
                throw new Error('Failed to fetch replies');
            }
            const replies = await response.json();
            return replies;
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ backgroundColor: '#1DA1F2', color: 'white', padding: '10px', textAlign: 'center' }}>
                <h1>TweetNest</h1>
            </header>
            <main>
                <Feed posts={posts} addPost={addPost} editPost={editPost} likePost={likePost} addReply={addReply} fetchReplies={fetchReplies} />
            </main>
            <footer style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#555' }}>
                <p>© 2025 TweetNest </p>
            </footer>
        </div>
    );
}

export default App;