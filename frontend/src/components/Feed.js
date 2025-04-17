import React, { useState } from 'react';

function Feed({ posts, addPost, editPost, likePost, addReply, fetchReplies }) {
    const [editingPostId, setEditingPostId] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [replies, setReplies] = useState({});
    const [replyInputs, setReplyInputs] = useState({}); // State to manage reply inputs for each post

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

    const handleFetchReplies = async (postId) => {
        const fetchedReplies = await fetchReplies(postId);
        setReplies((prevReplies) => ({
            ...prevReplies,
            [postId]: fetchedReplies,
        }));
    };

    const handleReplyInputChange = (postId, field, value) => {
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [postId]: {
                ...prevInputs[postId],
                [field]: value,
            },
        }));
    };

    const handleAddReply = async (postId) => {
        const replyInput = replyInputs[postId] || {};
        const { replyAuthor, replyContent } = replyInput;

        if (!replyContent?.trim() || !replyAuthor?.trim()) return;

        await addReply(postId, replyAuthor, replyContent);

        // Clear the reply inputs for this post
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [postId]: { replyAuthor: '', replyContent: '' },
        }));

        handleFetchReplies(postId);
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
            {posts.map((post) => {
                const replyInput = replyInputs[post.id] || { replyAuthor: '', replyContent: '' };

                return (
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
                        <button onClick={() => handleFetchReplies(post.id)}>View Replies</button>
                        <div>
                            {replies[post.id] &&
                                replies[post.id].map((reply) => (
                                    <div key={reply.id} style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
                                        <p><strong>{reply.author}</strong>: {reply.content}</p>
                                    </div>
                                ))}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <input
                                type="text"
                                placeholder="Reply Author"
                                value={replyInput.replyAuthor}
                                onChange={(e) => handleReplyInputChange(post.id, 'replyAuthor', e.target.value)}
                                style={{ marginBottom: '5px', padding: '5px', width: '100%' }}
                            />
                            <input
                                type="text"
                                placeholder="Write a reply..."
                                value={replyInput.replyContent}
                                onChange={(e) => handleReplyInputChange(post.id, 'replyContent', e.target.value)}
                                style={{ marginBottom: '5px', padding: '5px', width: '100%' }}
                            />
                            <button onClick={() => handleAddReply(post.id)} style={{ padding: '5px 10px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Reply
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Feed;