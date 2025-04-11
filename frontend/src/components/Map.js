import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Paper, Typography, Grid, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for user location
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for selected station
const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const useStyles = styled((theme) => ({
    popupContent: {
        padding: theme.spacing(1),
        minWidth: '200px'
    },
    stationName: {
        fontWeight: 'bold',
        marginBottom: theme.spacing(1)
    },
    stationDetails: {
        marginBottom: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    reserveButton: {
        marginTop: theme.spacing(1)
    }
}));

const Map = ({ stations, selectedStation, userLocation, onStationClick }) => {
    const classes = useStyles();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([48.8566, 2.3522], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add station markers
        stations.forEach(station => {
            const marker = L.marker([station.coordonneesXY[1], station.coordonneesXY[0]])
                .addTo(mapInstanceRef.current)
                .bindPopup(`
                    <div class="${classes.popupContent}">
                        <strong>${station.nom_station}</strong><br>
                        <strong>Adresse:</strong> ${station.adresse_station}<br>
                        <strong>Puissance:</strong> ${station.puissance_nominale} kW<br>
                        <strong>Types de prises:</strong> 
                        ${station.prise_type_2 ? ' Type 2,' : ''}
                        ${station.prise_type_combo_ccs ? ' CCS,' : ''}
                        ${station.prise_type_chademo ? ' CHAdeMO,' : ''}
                        ${station.prise_type_ef ? ' EF,' : ''}
                        ${station.prise_type_autre ? ' Autre' : ''}<br>
                        <strong>Accès:</strong> ${station.condition_acces}<br>
                        <strong>Horaires:</strong> ${station.horaires}<br>
                        <button onclick="window.selectStation(${station._id})">Réserver</button>
                    </div>
                `);

            marker.on('click', () => {
                onStationClick(station);
            });

            markersRef.current.push(marker);
        });

        // Add user location marker if available
        if (userLocation) {
            const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<div style="background-color: #2196f3; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                    iconSize: [12, 12]
                })
            }).addTo(mapInstanceRef.current);

            userMarker.bindPopup('Votre position').openPopup();
            markersRef.current.push(userMarker);
        }
    }, [stations, userLocation, onStationClick, classes.popupContent]);

    useEffect(() => {
        if (selectedStation && mapInstanceRef.current) {
            mapInstanceRef.current.setView(
                [selectedStation.coordonneesXY[1], selectedStation.coordonneesXY[0]],
                15
            );
        }
    }, [selectedStation]);

    return (
        <div ref={mapRef} style={{ height: '100%', width: '100%', position: 'relative' }}>
            <style>
                {`
                    .user-location-marker {
                        background: none;
                        border: none;
                    }
                    .leaflet-popup-content {
                        margin: 8px;
                    }
                    .leaflet-popup-content button {
                        background-color: #1976d2;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 8px;
                    }
                    .leaflet-popup-content button:hover {
                        background-color: #1565c0;
                    }
                `}
            </style>
        </div>
    );
};

export default Map; 