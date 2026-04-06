import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTheme, ThemeProvider, CssBaseline, Card, CardContent,
  CardMedia, Typography, Container, AppBar, Toolbar, Box,
  Paper, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

interface Staff {
  id: number;
  name: string;
  post: string;
  department?: string;
  image: string;
  status?: 'active' | 'on_leave';
}

const StaffCard = styled(Card)(({ theme }) => ({
  maxWidth: 240,
  margin: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : theme.palette.background.paper, // dark:bg-gray-800
}));

const Staff: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/staff/`);
        const data = await response.json();
        if (data.success) {
          setStaffMembers(data.data);
        } else {
          setError('Failed to load staff data.');
        }
      } catch (err) {
        setError('An error occurred while fetching staff data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/staff/${id}`);
  };

  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: prefersDarkMode ? '#60a5fa' : '#2563eb', // dark:text-blue-400 (#60a5fa), light:text-blue-600 (#2563eb)
      },
      secondary: {
        main: prefersDarkMode ? '#f472b6' : '#dc004e', // Consistent with original secondary
      },
      background: {
        default: prefersDarkMode ? '#111827' : '#f5f5f5', // dark:bg-gray-950 (#111827), light:bg-gray-50 (#f5f5f5)
        paper: prefersDarkMode ? '#1f2937' : '#ffffff', // dark:bg-gray-800 (#1f2937), light:bg-white
      },
      text: {
        primary: prefersDarkMode ? '#d1d5db' : '#1f2937', // dark:text-gray-300 (#d1d5db), light:text-gray-800 (#1f2937)
        secondary: prefersDarkMode ? '#9ca3af' : '#6b7280', // dark:text-gray-400 (#9ca3af), light:text-gray-500 (#6b7280)
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

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Paper sx={{ minHeight: '100vh', backgroundColor: muiTheme.palette.background.default }}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                School Staff Directory
              </Typography>
              <Typography variant="subtitle2" component="div">
                Explore profiles of our dedicated faculty and staff
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {loading && (
            <Typography align="center" variant="h6" sx={{ my: 4, color: muiTheme.palette.text.primary }}>
              Loading staff data...
            </Typography>
          )}

          {error && (
            <Typography align="center" variant="h6" sx={{ my: 4, color: 'error.main' }}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
              {staffMembers.map((staff) => (
                <Grid item key={staff.id} xs={6} sm={4} md={3} lg={2}>
                  <StaffCard
                    onClick={() => handleCardClick(staff.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCardClick(staff.id)}
                    aria-label={`View details for ${staff.name}`}
                  >
                    <Box sx={{ position: 'relative' }}>
                      {/* Status Circle */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor:
                            staff.status === 'active'
                              ? 'success.main'
                              : staff.status === 'on_leave'
                              ? 'error.main'
                              : 'grey.500',
                          border: '2px solid',
                          borderColor: muiTheme.palette.background.paper,
                          zIndex: 1,
                        }}
                        title={
                          staff.status === 'active'
                            ? 'Active'
                            : staff.status === 'on_leave'
                            ? 'On Leave'
                            : 'Status Unknown'
                        }
                      />

                      <CardMedia
                        component="img"
                        height="120"
                        image={staff.image || '/default-staff.jpg'}
                        alt={staff.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = '/default-staff.jpg';
                        }}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" align="center">
                        {staff.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" align="center">
                        {staff.post}
                      </Typography>
                      {staff.department && (
                        <Typography variant="body2" color="text.secondary" align="center">
                          {staff.department}
                        </Typography>
                      )}
                    </CardContent>
                  </StaffCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Paper>
    </ThemeProvider>
  );
};

export default Staff;