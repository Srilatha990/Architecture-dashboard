
import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, TextareaAutosize, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Projects = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const base_URL = 'https://architecture-backend-five.vercel.app';

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();
  }, []);

  // Handle form submission
  const handleProjectSubmit = async () => {
    if (!projectTitle.trim() || !projectDescription.trim()) {
      toast.error('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', projectTitle);
    formData.append('description', projectDescription);
    if (projectImage) {
      formData.append('image', projectImage);
    }

    try {
      if (editingProject) {
        const response = await axios.put(`${base_URL}/api/projects/${editingProject._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProjects(projects.map((project) => (project._id === response.data._id ? response.data : project)));
        toast.success('Project updated successfully!');
      } else {
        const response = await axios.post(`${base_URL}/api/projects`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProjects([...projects, response.data]);
        toast.success('Project added successfully!');
      }
      setProjectTitle('');
      setProjectDescription('');
      setProjectImage(null);
      setEditingProject(null);
    } catch (error) {
      toast.error('Error adding/updating project');
    }
  };

  // Confirm delete project
  const confirmDeleteProject = (project) => {
    const confirmation = window.confirm('Are you sure you want to delete this project?');
    if (confirmation) {
      try {
        axios.delete(`${base_URL}/api/projects/${project._id}`);
        setProjects(projects.filter((item) => item._id !== project._id));
        toast.success('Project deleted successfully!');
      } catch (error) {
        toast.error('Error deleting project');
      }
    }
  };

  // Handle edit project
  const handleEditProject = (project) => {
    window.scrollTo(0, 0);
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          {editingProject ? 'Edit Project' : 'Add Project'}
        </Typography>
        <TextField
          label="Project Title"
          variant="outlined"
          fullWidth
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
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
          aria-label="Project Description"
          placeholder="Enter project description"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#fff',
            borderColor: '#603F83FF',
            borderRadius: '4px',
          }}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProjectImage(e.target.files[0])}
          style={{ marginTop: 10 }}
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleProjectSubmit}
          sx={{ backgroundColor: '#603F83FF', marginTop: 2 }}
        >
          {editingProject ? 'Update' : 'Add'} Project
        </Button>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          Projects
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#603F83FF' }}>Title</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Description</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Image</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description.slice(0, 50)}...</TableCell>
                  <TableCell>
                    {project.image && <img src={project.image} alt={project.title} width={50} />}
                  </TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleEditProject(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDeleteProject(project)}>
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

export default Projects;
