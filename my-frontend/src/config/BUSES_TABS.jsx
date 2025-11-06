import { ICONS } from "./ICONS";

export const BUSES_TABS = {
    all: {
        label: 'ALL BUSES',
        icon: ICONS.plane,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'license_plate', label: 'License Plate', width: '150px' },
            { key: 'seats', label: 'Seats', width: '100px' },
            { key: 'driver_name', label: 'Driver', width: '200px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created_at', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '150px' },
        ]
    },
};