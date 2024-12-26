import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Tab, Tabs } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import axios from 'axios';
import logo from './logo.png';  // Add logo if necessary
import ProjectComponent from './ProjectPage';
import Blogs from './BlogsPage';
import Services from './ServicesPage';
import { toast, Toaster } from 'react-hot-toast';
import CareersPage from './FaqPage';

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'services');
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const base_URL = 'https://architecture-backend-five.vercel.app';

  // Fetch data based on the active tab
  const fetchData = async () => {
    try {
      if (activeTab === 'services') {
        const response = await axios.get(`${base_URL}/api/services`);
        setServices(response.data);
      } else if (activeTab === 'blogs') {
        const response = await axios.get(`${base_URL}/api/blogs`);
        setBlogs(response.data);
      } else if (activeTab === 'projects') {
        const response = await axios.get(`${base_URL}/api/projects`);
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token
    navigate('/login');  // Redirect to login page
    toast.success('Logged out successfully!');
  };

  const renderTabContent = () => {
    if (activeTab === 'services') {
      return <div style={{margin:'4vh'}}><Services /></div>;
    } else if (activeTab === 'blogs') {
      return <Blogs />;
    } else if (activeTab === 'projects') {
      return <ProjectComponent />;
    } else if (activeTab === 'careers') {
      return <CareersPage />;
    }
  };

  return (
    <Container maxWidth="lg">
      {/* AppBar/Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: '#C7D3D4FF' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: isMobile ? 'block' : 'none' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#603F83FF' }}>
            Dashboard
          </Typography>

          {/* Logout Button */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{
              marginLeft: 2,
              color: '#603F83FF',
              borderColor: '#603F83FF',
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#f4f4f4',
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavClick('services')}>
            <ListItemText primary="Manage Services" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('blogs')}>
            <ListItemText primary="Manage Blogs" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('projects')}>
            <ListItemText primary="Manage Projects" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('careers')}>
            <ListItemText primary="Manage Careers" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Tab Navigation */}
      <Box sx={{ padding: 3 }}>
        <Tabs value={activeTab} onChange={(e, newTab) => setActiveTab(newTab)} variant="scrollable" scrollButtons="auto">
          <Tab label="Services" value="services" />
          <Tab label="Blogs" value="blogs" />
          <Tab label="Projects" value="projects" />
          <Tab label="Faqs" value="careers" />
        </Tabs>

        {/* Tab Content */}
        {renderTabContent()}
      </Box>

      {/* Toast Notifications */}
      <Toaster />
    </Container>
  );
};

export default Dashboard;
