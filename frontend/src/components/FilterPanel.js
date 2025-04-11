import React from 'react';
import {
    Paper,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';

const FilterPanel = ({ filters, onFilterChange }) => {
    const handleChange = (name) => (event) => {
        onFilterChange({
            ...filters,
            [name]: event.target.value
        });
    };

    return (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>
                Filtres
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography gutterBottom>Puissance (kW)</Typography>
                    <Slider
                        value={filters.power}
                        onChange={(event, newValue) => {
                            onFilterChange({
                                ...filters,
                                power: newValue
                            });
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={350}
                        step={10}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Type de prise</InputLabel>
                        <Select
                            value={filters.connectorType}
                            onChange={handleChange('connectorType')}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="Type 2">Type 2</MenuItem>
                            <MenuItem value="CCS">CCS</MenuItem>
                            <MenuItem value="CHAdeMO">CHAdeMO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Accessibilité</InputLabel>
                        <Select
                            value={filters.accessibility}
                            onChange={handleChange('accessibility')}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Privé</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default FilterPanel; 