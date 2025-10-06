import { ICONS } from "./ICONS";

export const BUSES_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'license', label: 'License', width: '200px' },
            { key: 'capacity', label: 'Capacity', width: '250px' },
            { key: 'driver', label: 'Driver', width: '150px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '150px' },
        ]
    },

};