import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createTheme, ThemeProvider, CssBaseline, Box, Avatar, Typography,
  Container, Button, Divider, Paper, Stack, Chip, useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface StaffProfileData {
  id: number;
  name: string;
  post: string;
  department?: string;
  qualification?: string;
  contact?: string;
  email?: string;
  doj?: string;
  bio?: string;
  image: string;
}

const StaffProfile: React.FC = () => {
  const [staff, setStaff] = useState<StaffProfileData | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width:600px)'); // Detect mobile screens

  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: prefersDarkMode ? '#60a5fa' : '#2563eb',
      },
      background: {
        default: prefersDarkMode ? '#111827' : '#f5f5f5',
        paper: prefersDarkMode ? '#1f2937' : '#ffffff',
      },
      text: {
        primary: prefersDarkMode ? '#d1d5db' : '#1f2937',
        secondary: prefersDarkMode ? '#9ca3af' : '#6b7280',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/staff/${id}/`);
        const data = await response.json();
        if (data.success) {
          setStaff(data.data);
        }
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };
    fetchStaffDetails();
  }, [id]);

  // Ensure the page scrolls to the top on load
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top-left of the page
  }, []); // Empty dependency array runs once on mount

  if (!staff) return <Typography sx={{ color: muiTheme.palette.text.primary, textAlign: 'center', my: 4 }}>Loading...</Typography>;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh', // Ensure content takes at least full viewport height
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: muiTheme.palette.background.default,
          pb: isMobile ? 4 : 0, // Add padding at bottom for mobile to avoid overlap
        }}
      >
        <Container maxWidth="md" sx={{ py: 4, flex: 1 }}> {/* flex: 1 to grow and fill space */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3, color: muiTheme.palette.text.primary }}
          >
            Back to Staff
          </Button>

          <Paper elevation={3} sx={{ p: 4, backgroundColor: muiTheme.palette.background.paper }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              <Avatar
                src={staff.image}
                alt={staff.name}
                sx={{ width: 200, height: 200 }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = '/default-staff.jpg';
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>
                  {staff.name}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {staff.post}
                </Typography>
                {staff.department && (
                  <Chip
                    label={staff.department}
                    sx={{ mb: 2, backgroundColor: prefersDarkMode ? '#374151' : '#e5e7eb', color: prefersDarkMode ? '#d1d5db' : '#1f2937' }}
                  />
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 4, backgroundColor: prefersDarkMode ? '#374151' : '#e5e7eb' }} />

            <Grid container spacing={4}>
              {staff.qualification && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>Qualification</Typography>
                  <Typography sx={{ color: muiTheme.palette.text.secondary }}>{staff.qualification}</Typography>
                </Grid>
              )}
              {staff.doj && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>Date of Joining</Typography>
                  <Typography sx={{ color: muiTheme.palette.text.secondary }}>{new Date(staff.doj).toLocaleDateString()}</Typography>
                </Grid>
              )}
              {staff.contact && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>Contact</Typography>
                  <Typography sx={{ color: muiTheme.palette.text.secondary }}>{staff.contact}</Typography>
                </Grid>
              )}
              {staff.email && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>Email</Typography>
                  <Typography sx={{ color: muiTheme.palette.text.secondary }}>{staff.email}</Typography>
                </Grid>
              )}
              {staff.bio && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: muiTheme.palette.text.primary }}>Bio</Typography>
                  <Typography sx={{ color: muiTheme.palette.text.secondary, whiteSpace: 'pre-line' }}>{staff.bio}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default StaffProfile;