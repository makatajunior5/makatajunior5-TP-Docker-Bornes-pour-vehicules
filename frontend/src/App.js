import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, Snackbar, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ReservationForm from './components/ReservationForm';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [stations, setStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [filters, setFilters] = useState({
        power: 0,
        connectorType: '',
        accessibility: ''
    });
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchStations();
        getUserLocation();
    }, []);

    const fetchStations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/stations`);
            setStations(response.data);
            setFilteredStations(response.data);
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyStations = async (latitude, longitude) => {
        try {
            const response = await axios.get(`${API_URL}/stations/nearby`, {
                params: { latitude, longitude, maxDistance: 10000 }
            });
            setFilteredStations(response.data);
            setSnackbar({
                open: true,
                message: `${response.data.length} stations trouvées à proximité`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error fetching nearby stations:', error);
            setSnackbar({
                open: true,
                message: 'Erreur lors de la recherche des stations à proximité',
                severity: 'error'
            });
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    fetchNearbyStations(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setSnackbar({
                        open: true,
                        message: 'Impossible d\'obtenir votre position',
                        severity: 'error'
                    });
                }
            );
        } else {
            setSnackbar({
                open: true,
                message: 'La géolocalisation n\'est pas supportée par votre navigateur',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        let filtered = [...stations];

        if (filters.power > 0) {
            filtered = filtered.filter(station => station.puissance_nominale >= filters.power);
        }
        
        if (filters.connectorType) {
            if (filters.connectorType === 'Type 2') {
                filtered = filtered.filter(station => station.prise_type_2);
            } else if (filters.connectorType === 'CCS') {
                filtered = filtered.filter(station => station.prise_type_combo_ccs);
            } else if (filters.connectorType === 'CHAdeMO') {
                filtered = filtered.filter(station => station.prise_type_chademo);
            }
        }
        
        if (filters.accessibility) {
            if (filters.accessibility === 'public') {
                filtered = filtered.filter(station => station.condition_acces === 'Accès libre');
            } else if (filters.accessibility === 'private') {
                filtered = filtered.filter(station => station.condition_acces !== 'Accès libre');
            }
        }

        setFilteredStations(filtered);
    }, [filters, stations]);

    const handleStationSelect = (station) => {
        setSelectedStation(station);
    };

    const handleReservationSubmit = async (reservationData) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_URL}/reservations`, reservationData);
            setIsReservationOpen(false);
            setSnackbar({
                open: true,
                message: 'Réservation effectuée avec succès!',
                severity: 'success'
            });
            setSelectedStation(null);
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ position: 'relative', height: '100vh' }}>
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 1000
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            position: 'absolute',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Typography variant="h4" gutterBottom>
                    Stations de Recharge Électrique
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <SearchBar
                            stations={stations}
                            onStationSelect={handleStationSelect}
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={getUserLocation}
                            style={{ marginBottom: '20px' }}
                        >
                            Stations à proximité
                        </Button>
                        <FilterPanel
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper style={{ height: '600px', overflow: 'hidden' }}>
                            <Map
                                stations={filteredStations}
                                selectedStation={selectedStation}
                                userLocation={userLocation}
                                onStationClick={(station) => {
                                    setSelectedStation(station);
                                    setIsReservationOpen(true);
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <ReservationForm
                    station={selectedStation}
                    open={isReservationOpen}
                    onClose={() => setIsReservationOpen(false)}
                    onSubmit={handleReservationSubmit}
                />
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert 
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}

export default App;
