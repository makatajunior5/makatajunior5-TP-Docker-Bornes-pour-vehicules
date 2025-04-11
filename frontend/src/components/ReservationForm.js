import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    Divider,
    styled,
    Alert
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';

const useStyles = styled((theme) => ({
    stationInfo: {
        marginBottom: theme.spacing(2)
    },
    stationName: {
        fontWeight: 'bold'
    },
    divider: {
        margin: theme.spacing(2, 0)
    },
    formField: {
        marginBottom: theme.spacing(2)
    }
}));

const ReservationForm = ({ station, open, onClose, onSubmit }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        startDate: new Date(),
        startTime: new Date(),
        endDate: new Date(),
        endTime: new Date()
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate required fields
        if (!formData.userName.trim()) {
            newErrors.userName = 'Le nom est requis';
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Le numéro de téléphone est requis';
        }

        // Validate dates
        const startDateTime = new Date(formData.startDate);
        startDateTime.setHours(formData.startTime.getHours());
        startDateTime.setMinutes(formData.startTime.getMinutes());
        
        const endDateTime = new Date(formData.endDate);
        endDateTime.setHours(formData.endTime.getHours());
        endDateTime.setMinutes(formData.endTime.getMinutes());

        if (startDateTime >= endDateTime) {
            newErrors.date = 'La date de fin doit être postérieure à la date de début';
        }

        if (startDateTime < new Date()) {
            newErrors.date = 'La date de début ne peut pas être dans le passé';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const startDateTime = new Date(formData.startDate);
        startDateTime.setHours(formData.startTime.getHours());
        startDateTime.setMinutes(formData.startTime.getMinutes());
        
        const endDateTime = new Date(formData.endDate);
        endDateTime.setHours(formData.endTime.getHours());
        endDateTime.setMinutes(formData.endTime.getMinutes());
        
        onSubmit({
            userName: formData.userName,
            phoneNumber: formData.phoneNumber,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            stationId: station._id
        });
    };

    if (!station) return null;

    // Déterminer les types de prises disponibles
    const connectorTypes = [];
    if (station.prise_type_2) connectorTypes.push('Type 2');
    if (station.prise_type_combo_ccs) connectorTypes.push('CCS');
    if (station.prise_type_chademo) connectorTypes.push('CHAdeMO');
    if (station.prise_type_ef) connectorTypes.push('EF');
    if (station.prise_type_autre) connectorTypes.push('Autre');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Réserver une station de recharge</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {Object.keys(errors).length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {Object.values(errors).map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </Alert>
                    )}
                    
                    <div className={classes.stationInfo}>
                        <Typography variant="h6" className={classes.stationName}>
                            {station.nom_station}
                        </Typography>
                        <Typography variant="body2">
                            {station.adresse_station}
                        </Typography>
                        <Typography variant="body2">
                            Puissance: {station.puissance_nominale} kW | Types: {connectorTypes.join(', ')}
                        </Typography>
                        <Typography variant="body2">
                            Accès: {station.condition_acces} | Horaires: {station.horaires}
                        </Typography>
                    </div>
                    
                    <Divider className={classes.divider} />
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="userName"
                                label="Votre nom"
                                value={formData.userName}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.userName}
                                helperText={errors.userName}
                                className={classes.formField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="phoneNumber"
                                label="Numéro de téléphone"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                className={classes.formField}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Début de la recharge</Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                <DatePicker
                                    label="Date"
                                    value={formData.startDate}
                                    onChange={(date) => handleDateChange('startDate', date)}
                                    fullWidth
                                    required
                                    className={classes.formField}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                <TimePicker
                                    label="Heure"
                                    value={formData.startTime}
                                    onChange={(time) => handleDateChange('startTime', time)}
                                    fullWidth
                                    required
                                    className={classes.formField}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Fin de la recharge</Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                <DatePicker
                                    label="Date"
                                    value={formData.endDate}
                                    onChange={(date) => handleDateChange('endDate', date)}
                                    fullWidth
                                    required
                                    className={classes.formField}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                                <TimePicker
                                    label="Heure"
                                    value={formData.endTime}
                                    onChange={(time) => handleDateChange('endTime', time)}
                                    fullWidth
                                    required
                                    className={classes.formField}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        Confirmer la réservation
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReservationForm; 