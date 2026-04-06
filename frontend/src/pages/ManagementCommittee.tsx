import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTheme, ThemeProvider, CssBaseline, Card, CardContent,
  CardMedia, Typography, Container, AppBar, Toolbar, Box, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

interface CommitteeMember {
  id: number;
  name: string;
  position: string;
  contact_no: string;
  image: string;
  site_position: string;
  committee_type: string;
}

const CommitteeCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : theme.palette.background.paper, // dark:bg-gray-800
}));

const Committee: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [managementCommittee, setManagementCommittee] = useState<CommitteeMember[]>([]);
  const [ptaCommittee, setPtaCommittee] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        // Fetch Management Committee
        const mgmtResponse = await fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/committee/MANAGEMENT_COMMITTEE/`);
        const mgmtData = await mgmtResponse.json();
        
        // Fetch PTA
        const ptaResponse = await fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/committee/PTA/`);
        const ptaData = await ptaResponse.json();

        if (mgmtData.members && ptaData.members) {
          setManagementCommittee(mgmtData.members);
          setPtaCommittee(ptaData.members);
        } else {
          setError('Failed to load committee data.');
        }
      } catch (err) {
        setError('An error occurred while fetching committee data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, []);

  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2E7D32', // Green for Management Committee (unchanged)
      },
      secondary: {
        main: '#1565C0', // Blue for PTA (unchanged)
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

  const renderCommitteeSection = (title: string, members: CommitteeMember[], color: string) => {
    // Find special positioned members (0 and 1)
    const specialMembers = members.filter(m => ['0', '1'].includes(m.site_position));
    const regularMembers = members.filter(m => !['0', '1'].includes(m.site_position));

    return (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ 
          color,
          mb: 4,
          mt:4,
          borderBottom: `2px solid ${color}`,
          pb: 1,
          textTransform: 'uppercase'
        }}>
          {title}
        </Typography>

        {/* Special Positioned Members (Centered) */}
        {specialMembers.length > 0 && (
          <Grid container justifyContent="center" spacing={4} sx={{ mb: 4 }}>
            {specialMembers.map((member) => (
              <Grid item key={member.id} xs={12} md={6}>
                <CommitteeCard sx={{ mx: 'auto', borderTop: `4px solid ${color}`, backgroundColor: muiTheme.palette.background.paper }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={member.image}
                    alt={member.name}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = '/default-committee.jpg';
                    }}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center" sx={{ color: muiTheme.palette.text.primary }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" align="center">
                      {member.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {member.contact_no}
                    </Typography>
                  </CardContent>
                </CommitteeCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Regular Members */}
        <Grid container spacing={4} justifyContent="center">
          {regularMembers.map((member) => (
            <Grid item key={member.id} xs={12} sm={6} md={4} lg={3}>
              <CommitteeCard sx={{ borderTop: `4px solid ${color}`, backgroundColor: muiTheme.palette.background.paper }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={member.image}
                  alt={member.name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = '/default-committee.jpg';
                  }}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" align="center" sx={{ color: muiTheme.palette.text.primary }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" align="center">
                    {member.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {member.contact_no}
                  </Typography>
                </CardContent>
              </CommitteeCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, mb:4, backgroundColor: muiTheme.palette.background.default }}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="div" sx={{ color: muiTheme.palette.text.primary }}>
                School Committee
              </Typography>
              <Typography variant="subtitle1" component="div" color="text.primary">
                Meet our dedicated committee members
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {loading && (
          <Typography align="center" variant="h6" sx={{ my: 4, color: muiTheme.palette.text.primary }}>
            Loading committee data...
          </Typography>
        )}

        {error && (
          <Typography align="center" variant="h6" sx={{ my: 4, color: 'error.main' }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <>
            {renderCommitteeSection("Management Committee", managementCommittee, muiTheme.palette.primary.main)}
            {renderCommitteeSection("Parent Teacher Association", ptaCommittee, muiTheme.palette.secondary.main)}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Committee;