const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'your_mongodb_connection_string_here';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const BlogSchema = new mongoose.Schema({
    title: String,
    user: String,
    markdown: String,
    image: String
});
const Blog = mongoose.model('Blog', BlogSchema);

app.post('/upload', async (req, res) => {
    const { title, user, markdownUrl, imageUrl } = req.body;
    console.log(`📥 Received new blog from ${user}: ${title}`);

    try {
        const mdResponse = await axios.get(markdownUrl);
        const markdownContent = mdResponse.data;

        const blog = new Blog({ title, user, markdown: markdownContent, image: imageUrl });
        await blog.save();

        console.log(`✅ Blog saved: ${title}`);
        res.status(201).json({ message: 'Blog saved!' });
    } catch (error) {
        console.error('❌ Error saving blog:', error);
        res.status(500).json({ error: 'Failed to upload blog.' });
    }
});

app.get('/blogs', async (req, res) => {
    const userFilter = req.query.user ? { user: req.query.user } : {};
    const blogs = await Blog.find(userFilter);
    console.log(`📤 Sending ${blogs.length} blogs`);
    res.json(blogs);
});

app.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    console.log(`📤 Sending blog: ${blog.title}`);
    res.json(blog);
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
