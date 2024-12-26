import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  
import toast, { Toaster } from 'react-hot-toast'; 

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminEmail = 'admin@architecture.tech';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const uniqueToken = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('token', uniqueToken);
      setAuth(true); 
      navigate('/dashboard'); 
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <div className="bg-white p-4 rounded shadow" style={{ borderRadius: '12px', border: '1px solid #C7D3D4FF' }}>
            <h3 className="text-center text-primary mb-4">Admin Login</h3>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="text-primary">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderColor: '#C7D3D4FF',
                    borderRadius: '8px',
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="text-primary">Password</Form.Label>
                <InputGroup>
                  <FormControl
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: '#F5F5F5',
                      borderColor: '#C7D3D4FF',
                      borderRadius: '8px',
                    }}
                  />
                  <InputGroup.Text 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{
                      backgroundColor: '#C7D3D4FF', 
                      cursor: 'pointer',
                      borderRadius: '0 8px 8px 0',
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                className="w-100 mt-4" 
                style={{
                  // backgroundColor: '#603F83FF',
                  borderColor: '#603F83FF',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                }}
              >
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <Toaster position="top-center" reverseOrder={false} />
    </Container>
  );
};

export default Login;
