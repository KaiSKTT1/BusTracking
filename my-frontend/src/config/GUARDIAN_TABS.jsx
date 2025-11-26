import { ICONS } from "./ICONS";

export const GUARDIAN_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'actions', label: 'Actions', width: '150px' }
        ]
    },
    suspended: {
        label: 'SUSPENDED',
        icon: ICONS.suspended,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'email', label: 'Email', width: '250px' },
            { key: 'phone', label: 'Phone', width: '150px' },
            { key: 'role', label: 'Role', width: '120px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created_at', label: 'Created', width: '150px' },
            { key: 'actions', label: 'Actions', width: '150px' }
        ]
    }
};