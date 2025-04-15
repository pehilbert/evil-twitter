import React, { useState } from 'react';

function Feed({ posts, addPost, editPost, likePost }) {
    const [editingPostId, setEditingPostId] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    const handleEditClick = (post) => {
        setEditingPostId(post.id);
        setNewContent(post.content);
    };

    const handleEditSubmit = (postId) => {
        editPost(postId, newContent);
        setEditingPostId(null);
        setNewContent('');
    };

    const handleAddPost = (e) => {
        e.preventDefault();
        if (author.trim() && content.trim()) {
            addPost(author, content);
            setAuthor('');
            setContent('');
        }
    };

    return (
        <div>
            {/* Form to add a new post */}
            <form onSubmit={handleAddPost} style={{ marginBottom: '20px' }}>
                <h3>Create a New Post</h3>
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', height: '60px', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Submit
                </button>
            </form>

            {/* List of posts */}
            {posts.map((post) => (
                <div key={post.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                    <h3>{post.author}</h3>
                    {editingPostId === post.id ? (
                        <div>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                style={{ width: '100%', height: '60px' }}
                            />
                            <button onClick={() => handleEditSubmit(post.id)}>Save</button>
                            <button onClick={() => setEditingPostId(null)}>Cancel</button>
                        </div>
                    ) : (
                        <p>{post.content}</p>
                    )}
                    <p>Likes: {post.likes}</p>
                    <button onClick={() => likePost(post.id)}>Like</button>
                    <button onClick={() => handleEditClick(post)}>Edit</button>
                </div>
            ))}
        </div>
    );
}

export default Feed;