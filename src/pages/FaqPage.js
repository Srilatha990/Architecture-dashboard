import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FAQs = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const base_URL = 'https://architecture-backend-five.vercel.app';

  // Fetch FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/faqs`);
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs', error);
      }
    };

    fetchFAQs();
  }, []);

  // Handle form submission for FAQs
  const handleFAQSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error('Both fields are required.');
      return;
    }

    try {
      if (editingFAQ) {
        const response = await axios.put(`${base_URL}/api/faqs/${editingFAQ._id}`, { question, answer });
        setFaqs(faqs.map((faq) => (faq._id === response.data._id ? response.data : faq)));
        toast.success('FAQ updated successfully!');
      } else {
        const response = await axios.post(`${base_URL}/api/faqs`, { question, answer });
        setFaqs([...faqs, response.data]);
        toast.success('FAQ added successfully!');
      }
      setQuestion(''); // Reset to empty after submission
      setAnswer('');
      setEditingFAQ(null);
    } catch (error) {
      toast.error('Error adding/updating FAQ');
    }
  };

  // Confirm delete FAQ
  const confirmDeleteFAQ = (faq) => {
    const confirmation = window.confirm('Are you sure you want to delete this FAQ?');
    if (confirmation) {
      try {
        axios.delete(`${base_URL}/api/faqs/${faq._id}`);
        setFaqs(faqs.filter((item) => item._id !== faq._id));
        toast.success('FAQ deleted successfully!');
      } catch (error) {
        toast.error('Error deleting FAQ');
      }
    }
  };

  // Handle edit FAQ
  const handleEditFAQ = (faq) => {
    window.scrollTo(0, 0);
    setEditingFAQ(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          {editingFAQ ? 'Edit FAQ' : 'Add FAQ'}
        </Typography>
        <TextField
          label="Question"
          variant="outlined"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
        <TextField
          label="Answer"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
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
        <Button
          variant="contained"
          color="success"
          onClick={handleFAQSubmit}
          sx={{ backgroundColor: '#603F83FF', marginTop: 2 }}
        >
          {editingFAQ ? 'Update' : 'Add'} FAQ
        </Button>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#C7D3D4FF' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#603F83FF' }}>
          FAQs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#603F83FF' }}>Question</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Answer</TableCell>
                <TableCell sx={{ color: '#603F83FF' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq._id}>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>{faq.answer.slice(0, 50)}...</TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleEditFAQ(faq)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDeleteFAQ(faq)}>
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

export default FAQs;
