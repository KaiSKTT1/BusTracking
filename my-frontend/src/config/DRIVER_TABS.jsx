import { ICONS } from "./ICONS";

export const DRIVER_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'bus', label: 'Bus', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    suspended: {
        label: 'SUSPENDED',
        icon: ICONS.suspended,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'bus', label: 'Bus', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    under_review: {
        label: 'UNDER REVIEW',
        icon: ICONS.underReview,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'bus', label: 'Bus', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },

};