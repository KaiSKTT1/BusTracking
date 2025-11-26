import { ICONS } from "./ICONS";

export const STUDENT_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'parentName', label: 'Parent Name', width: '250px' },
            { key: 'parentEmail', label: 'Parent Email', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    suspended: {
        label: 'SUSPENDED',
        icon: ICONS.suspended,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'parentName', label: 'Parent Name', width: '250px' },
            { key: 'parentEmail', label: 'Parent Email', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    under_review: {
        label: 'UNDER REVIEW',
        icon: ICONS.underReview,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'parentName', label: 'Parent Name', width: '250px' },
            { key: 'parentEmail', label: 'Parent Email', width: '150px' },
            { key: 'morningBus', label: 'Morning Bus', width: '120px' },
            { key: 'afternoonBus', label: 'Afternoon Bus', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    out_of_coins: {
        label: 'OUT OF COINS',
        icon: ICONS.outOfCoins,
        columns: [
            { key: 'id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'parentName', label: 'Parent Name', width: '250px' },
            { key: 'parentEmail', label: 'Parent Email', width: '150px' },
            { key: 'morningBus', label: 'Morning Bus', width: '120px' },
            { key: 'afternoonBus', label: 'Afternoon Bus', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    }
};