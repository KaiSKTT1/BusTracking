import pool from '../configs/connectDB.js';

let getAllGuardians = async (req, res) => {
    console.log('Fetching all guardians...');
    try {
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role,
                ua.status
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE r.name_role = 'Parent'`
        );
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllGuardians:', err);
        return res.status(500).json({ message: err.message });
    }
};

let getGuardianById = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching guardian with id: ${id}`);
    try {
        const [rows] = await pool.execute(
            `SELECT 
                ua.user_id as id, 
                ua.username as name, 
                ua.email, 
                r.name_role as role,
                ua.status
             FROM user_account ua
             JOIN role r ON ua.role_id = r.role_id
             WHERE ua.user_id = ? AND r.name_role = 'Parent'`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }
        return res.status(200).json({ message: 'ok', data: rows[0] });
    } catch (err) {
        console.error(`Error in getGuardianById (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let createGuardian = async (req, res) => {
    console.log('Creating new guardian with body:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Missing required fields: username, email, password'
        });
    }

    try {
        const [existing] = await pool.execute(
            'SELECT user_id FROM user_account WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const [result] = await pool.execute(
            'INSERT INTO user_account (username, email, password, role_id, status) VALUES (?, ?, ?, 3, "active")',
            [username, email, password]
        );

        return res.status(201).json({
            message: 'Guardian created successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        console.error('Error in createGuardian:', err);
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE guardian
let updateGuardian = async (req, res) => {
    const { id } = req.params;
    // SỬA 1: Thêm 'status' vào đây
    const { username, email, password, status } = req.body;
    console.log(`Updating guardian ${id} with body:`, req.body); // Log này sẽ hiển thị cả status

    // SỬA 2: Thêm 'status' vào validation
    if (!username || !email || !status) {
        return res.status(400).json({
            message: 'Missing required fields: username, email, status'
        });
    }

    try {
        const [guardian] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        const [existing] = await pool.execute(
            'SELECT user_id FROM user_account WHERE email = ? AND user_id != ?',
            [email, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // SỬA 3: Cập nhật các câu query để bao gồm 'status'
        let result;
        if (password) {
            [result] = await pool.execute(
                'UPDATE user_account SET username = ?, email = ?, password = ?, status = ? WHERE user_id = ?',
                [username, email, password, status, id]
            );
        } else {
            [result] = await pool.execute(
                'UPDATE user_account SET username = ?, email = ?, status = ? WHERE user_id = ?',
                [username, email, status, id]
            );
        }
        
        // (Phần kiểm tra result.affectedRows đã có từ trước)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Guardian not found or data unchanged' });
        }

        return res.status(200).json({ message: 'Guardian updated successfully' });
    } catch (err) {
        console.error(`Error in updateGuardian (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let deleteGuardian = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting guardian with id: ${id}`);

    try {
        const [guardian] = await pool.execute(
            "SELECT ua.user_id FROM user_account ua JOIN role r ON ua.role_id = r.role_id WHERE ua.user_id = ? AND r.name_role = 'Parent'",
            [id]
        );

        if (guardian.length === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        const [students] = await pool.execute(
            'SELECT student_id FROM student WHERE id_ph = ?',
            [id]
        );

        if (students.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete guardian with assigned students'
            });
        }

        // Sửa: Lấy kết quả [result]
        const [result] = await pool.execute('DELETE FROM user_account WHERE user_id = ?', [id]);

        // Sửa: Kiểm tra affectedRows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Guardian not found' });
        }

        return res.status(200).json({ message: 'Guardian deleted successfully' });
    } catch (err) {
        console.error(`Error in deleteGuardian (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

export default {
    getAllGuardians,
    getGuardianById,
    createGuardian,
    updateGuardian,
    deleteGuardian
};