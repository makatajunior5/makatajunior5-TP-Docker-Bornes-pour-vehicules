const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    id_pdc_itinerance: {
        type: String,
        required: true,
        unique: true
    },
    observations: String,
    prise_type_2: Boolean,
    prise_type_autre: Boolean,
    prise_type_chademo: Boolean,
    prise_type_combo_ccs: Boolean,
    prise_type_ef: Boolean,
    puissance_nominale: Number,
    nom_amenageur: String,
    siren_amenageur: Number,
    contact_amenageur: String,
    nom_operateur: String,
    contact_operateur: String,
    nom_enseigne: String,
    id_station_itinerance: String,
    nom_station: String,
    implantation_station: String,
    adresse_station: String,
    coordonneesXY: {
        type: [Number],
        index: '2dsphere'
    },
    nbre_pdc: Number,
    gratuit: Boolean,
    paiement_acte: Boolean,
    paiement_cb: Boolean,
    paiement_autre: Boolean,
    condition_acces: String,
    reservation: Boolean,
    horaires: String,
    accessibilite_pmr: String,
    restriction_gabarit: String,
    station_deux_roues: Boolean,
    raccordement: String,
    num_pdl: String,
    date_mise_en_service: Date,
    date_maj: Date
});

module.exports = mongoose.model('Station', stationSchema); 