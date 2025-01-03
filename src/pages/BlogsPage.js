

import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, TextareaAutosize, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Blogs = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [blogCategory, setBlogCategory] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const base_URL = 'https://architecture-server.vercel.app';

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs', error);
      }
    };

    fetchBlogs();
  }, []);

  // Handle form submission
  const handleBlogSubmit = async () => {
    if (!blogTitle.trim() || !blogDescription.trim() || !blogCategory.trim() || !blogAuthor.trim()) {
      toast.error('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', blogTitle);
    formData.append('description', blogDescription);
    formData.append('category', blogCategory);
    formData.append('author', blogAuthor);
    if (blogImage) {
      formData.append('image', blogImage);
    }

    try {
      if (editingBlog) {
        const response = await axios.put(`${base_URL}/api/blogs/${editingBlog._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs(blogs.map((blog) => (blog._id === response.data._id ? response.data : blog)));
        toast.success('Blog updated successfully!');
      } else {
        const response = await axios.post(`${base_URL}/api/blogs`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs([...blogs, response.data]);
        toast.success('Blog added successfully!');
      }
      setBlogTitle('');
      setBlogDescription('');
      setBlogCategory('');
      setBlogAuthor('');
      setBlogImage(null);
      setEditingBlog(null);
    } catch (error) {
      toast.error('Error adding/updating blog');
    }
  };

  // Confirm delete blog
  const confirmDeleteBlog = (blog) => {
    const confirmation = window.confirm('Are you sure you want to delete this blog?');
    if (confirmation) {
      try {
        axios.delete(`${base_URL}/api/blogs/${blog._id}`);
        setBlogs(blogs.filter((item) => item._id !== blog._id));
        toast.success('Blog deleted successfully!');
      } catch (error) {
        toast.error('Error deleting blog');
      }
    }
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    window.scrollTo(0, 0);
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogDescription(blog.description);
    setBlogCategory(blog.category);
    setBlogAuthor(blog.author);
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          {editingBlog ? 'Edit Blog' : 'Add Blog'}
        </Typography>
        <TextField
          label="Blog Title"
          variant="outlined"
          fullWidth
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            },
            '& .MuiInputLabel-root': {
              color: '#603F83FF',
            },
          }}
        />
        <TextareaAutosize
          minRows={4}
          maxRows={6}
          aria-label="Blog Description"
          placeholder="Enter blog description"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#fff',
            borderColor: '#603F83FF',
            borderRadius: '4px',
          }}
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
        />

        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          value={blogCategory}
          onChange={(e) => setBlogCategory(e.target.value)}
          sx={{
            marginTop: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            },
            '& .MuiInputLabel-root': {
              color: '#603F83FF',
            },
          }}
        />
        <TextField
          label="Author"
          variant="outlined"
          fullWidth
          value={blogAuthor}
          onChange={(e) => setBlogAuthor(e.target.value)}
          sx={{
            marginTop: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            },
            '& .MuiInputLabel-root': {
              color: '#603F83FF',
            },
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBlogImage(e.target.files[0])}
          style={{ marginTop: 10 }}
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleBlogSubmit}
          sx={{ backgroundColor: '#603F83FF', marginTop: 2 }}
        >
          {editingBlog ? 'Update' : 'Add'} Blog
        </Button>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          Blogs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#603F83FF' }}>Title</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Description</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Category</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Author</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Image</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.description.slice(0, 50)}...</TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>
                    {blog.image && <img src={blog.image} alt={blog.title} width={50} />}
                  </TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleEditBlog(blog)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDeleteBlog(blog)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Blogs;
