import { ICONS } from "./ICONS";

export const STUDENT_TABS = {
    active: {
        label: 'ACTIVE',
        icon: ICONS.plane,
        columns: [
            { key: 'student_id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '250px' },
            { key: 'school_id', label: 'School ID', width: '200px' },
            { key: 'note', label: 'Note', width: '150px' },
            { key: 'id_ph', label: 'Id parent', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    suspended: {
        label: 'SUSPENDED',
        icon: ICONS.suspended,
        columns: [
            { key: 'student_id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '250px' },
            { key: 'school_id', label: 'School ID', width: '200px' },
            { key: 'note', label: 'Note', width: '150px' },
            { key: 'id_ph', label: 'Id parent', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    under_review: {
        label: 'UNDER REVIEW',
        icon: ICONS.underReview,
        columns: [
 { key: 'student_id', label: 'ID', width: '80px' },
            { key: 'student_id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '250px' },
            { key: 'school_id', label: 'School ID', width: '200px' },
            { key: 'note', label: 'Note', width: '150px' },
            { key: 'id_ph', label: 'Id parent', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    },
    out_of_coins: {
        label: 'OUT OF COINS',
        icon: ICONS.outOfCoins,
        columns: [
            { key: 'student_id', label: 'ID', width: '80px' },
            { key: 'name', label: 'Name', width: '250px' },
            { key: 'school_id', label: 'School ID', width: '200px' },
            { key: 'note', label: 'Note', width: '150px' },
            { key: 'id_ph', label: 'Id parent', width: '150px' },
            { key: 'status', label: 'Status', width: '120px' },
            { key: 'created', label: 'Created', width: '120px' },
            { key: 'actions', label: 'Actions', width: '120px' }
        ]
    }
};