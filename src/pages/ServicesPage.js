import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, TextareaAutosize, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Services = () => {
  const [serviceTitle, setServiceTitle] = useState(''); // Renamed to 'serviceTitle'
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceImage, setServiceImage] = useState(null);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceDescriptionLength, setServiceDescriptionLength] = useState(0);
  const base_URL = 'https://architecture-backend-five.vercel.app';

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, []);

  // Handle form submission
  const handleServiceSubmit = async () => {
    if (!serviceTitle.trim() || !serviceDescription.trim()) {
      toast.error('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', serviceTitle); // Changed 'name' to 'title'
    formData.append('description', serviceDescription);
    if (serviceImage) {
      formData.append('image', serviceImage);
    }

    try {
      if (editingService) {
        const response = await axios.put(`${base_URL}/api/services/${editingService._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setServices(services.map((service) => (service._id === response.data._id ? response.data : service)));
        toast.success('Service updated successfully!');
      } else {
        const response = await axios.post(`${base_URL}/api/services`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setServices([...services, response.data]);
        toast.success('Service added successfully!');
      }
      setServiceTitle(''); // Reset to empty after submission
      setServiceDescription('');
      setServiceImage(null);
      setEditingService(null);
    } catch (error) {
      toast.error('Error adding/updating service');
    }
  };

  // Confirm delete service
  const confirmDeleteService = (service) => {
    const confirmation = window.confirm('Are you sure you want to delete this service?');
    if (confirmation) {
      try {
        axios.delete(`${base_URL}/api/services/${service._id}`);
        setServices(services.filter((item) => item._id !== service._id));
        toast.success('Service deleted successfully!');
      } catch (error) {
        toast.error('Error deleting service');
      }
    }
  };

  // Handle edit service
  const handleEditService = (service) => {
    window.scrollTo(0, 0);
    setEditingService(service);
    setServiceTitle(service.title); // Changed from 'name' to 'title'
    setServiceDescription(service.description);
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          {editingService ? 'Edit Service' : 'Add Service'}
        </Typography>
        <TextField
          label="Service Title" // Changed label to 'Service Title'
          variant="outlined"
          fullWidth
          value={serviceTitle}
          onChange={(e) => setServiceTitle(e.target.value)} // Changed to 'serviceTitle'
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            },
            '& .MuiInputLabel-root': {
              color: '#603F83FF', // Royal Purple
            },
          }}
        />
        <TextareaAutosize
          minRows={4}
          maxRows={6}
          aria-label="Service Description"
          placeholder="Enter service description"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#fff',
            borderColor: '#603F83FF',
            borderRadius: '4px',
          }}
          value={serviceDescription}
          onChange={(e) => {
            const newDescription = e.target.value;
            setServiceDescription(newDescription);
            setServiceDescriptionLength(newDescription.length);
          }}
          maxLength={300}
        />
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          {300 - serviceDescriptionLength} characters left
        </Typography>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setServiceImage(e.target.files[0])}
          style={{ marginTop: 10 }}
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleServiceSubmit}
          sx={{ backgroundColor: '#603F83FF', marginTop: 2 }}
        >
          {editingService ? 'Update' : 'Add'} Service
        </Button>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          Services
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#603F83FF' }}>Title</TableCell> {/* Changed 'Name' to 'Title' */}
                <TableCell sx={{ color: '#603F83FF' }}>Description</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Image</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.title}</TableCell> {/* Changed to 'title' */}
                  <TableCell>{service.description.slice(0, 50)}...</TableCell>
                  <TableCell>
                    {service.image && <img src={service.image} alt={service.title} width={50} />} {/* Changed to 'title' */}
                  </TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleEditService(service)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDeleteService(service)}>
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

export default Services;
