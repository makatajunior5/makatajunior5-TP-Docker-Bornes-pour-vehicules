import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';

const SearchBar = ({ stations, onStationSelect }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setOptions(stations);
    }, [stations]);

    return (
        <Autocomplete
            value={null}
            onChange={(event, newValue) => {
                onStationSelect(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={options}
            getOptionLabel={(option) => option.nom_station}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Rechercher une station de recharge..."
                    fullWidth
                />
            )}
            style={{ width: '100%', marginBottom: '20px' }}
        />
    );
};

export default SearchBar; 