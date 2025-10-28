import { ICONS } from "./ICONS";

export const DRIVER_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
             { key: 'user_id', label: 'ID', width: '80px' },
            { key: 'role_id', label: 'ID Role', width: '200px' },
            { key: 'username', label: 'Username', width: '250px' },
            { key: 'password', label: 'Password', width: '150px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    suspended: {
        label: 'SUSPENDED',
        icon: ICONS.suspended,
        columns: [
            { key: 'user_id', label: 'ID', width: '80px' },
            { key: 'role_id', label: 'ID Role', width: '200px' },
            { key: 'username', label: 'Username', width: '250px' },
            { key: 'password', label: 'Password', width: '150px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    under_review: {
        label: 'UNDER REVIEW',
        icon: ICONS.underReview,
        columns: [
             { key: 'user_id', label: 'ID', width: '80px' },
            { key: 'role_id', label: 'ID Role', width: '200px' },
            { key: 'username', label: 'Username', width: '250px' },
            { key: 'password', label: 'Password', width: '150px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },

};