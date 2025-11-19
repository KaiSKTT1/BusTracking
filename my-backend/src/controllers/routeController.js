import pool from "../configs/connectDB.js";

// === QUẢN LÝ TUYẾN (ROUTE) ===
let getAllRoutes = async (req, res) => {
    console.log('Fetching all routes...');
    try {
        const [rows] = await pool.execute(
            `SELECT r.route_id, r.name, r.so_stop FROM route r`
        );
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllRoutes:', err);
        return res.status(500).json({ message: err.message });
    }
};

let createRoute = async (req, res) => {
    const { name, so_stop } = req.body;
    console.log('Creating new route:', req.body);
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || so_stop === undefined) {
        return res.status(400).json({ message: 'Missing fields: name, so_stop' });
    }
    
    try {
        const [result] = await pool.execute('INSERT INTO route (name, so_stop) VALUES (?, ?)', [name, so_stop]);
        return res.status(201).json({ message: 'Route created', id: result.insertId });
    } catch (err) {
        console.error('Error in createRoute:', err);
        return res.status(500).json({ message: err.message });
    }
};
let deleteRoute = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting route with id: ${id}`);
    
    try {
        // 1. Kiểm tra xem có 'trip' (chuyến đi) nào đang dùng route này không
        const [trips] = await pool.execute('SELECT trip_id FROM trip WHERE route_id = ?', [id]);
        if (trips.length > 0) {
            return res.status(400).json({ 
                message: 'Không thể xóa tuyến này: Tuyến đang được sử dụng bởi các chuyến đi (trips). Phải xóa các chuyến đi đó trước.' 
            });
        }

        // 2. Xóa các liên kết trong bảng 'route_stop'
        await pool.execute('DELETE FROM route_stop WHERE route_id = ?', [id]);
        
        // 3. Xóa tuyến đường trong bảng 'route'
        const [result] = await pool.execute('DELETE FROM route WHERE route_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Route not found' });
        }
        
        return res.status(200).json({ message: 'Route and associated stop links deleted' });
    } catch (err) {
        console.error(`Error in deleteRoute (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};


let getAllStops = async (req, res) => {
    console.log('Fetching all stops...');
    try {
        // Lấy tất cả các trạm, bao gồm cả tọa độ lat, lng
        const [rows] = await pool.execute('SELECT * FROM stop');
        return res.status(200).json({ message: 'ok', data: rows });
    } catch (err) {
        console.error('Error in getAllStops:', err);
        return res.status(500).json({ message: err.message });
    }
};

// Sửa: Thêm lat, lng
let createStop = async (req, res) => {
    const { name, address, lat, lng } = req.body;
    console.log('Creating new stop:', req.body);
    if (!name || !address || !lat || !lng) {
        return res.status(400).json({ message: 'Missing fields: name, address, lat, lng' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO stop (name, address, lat, lng) VALUES (?, ?, ?, ?)',
            [name, address, lat, lng]
        );
        return res.status(201).json({ message: 'Stop created', id: result.insertId });
    } catch (err) {
        console.error('Error in createStop:', err);
        return res.status(500).json({ message: err.message });
    }
};

// === QUẢN LÝ LIÊN KẾT (ROUTE_STOP) ===

// SỬA LẠI HOÀN TOÀN HÀM NÀY
let getStopsByRouteId = async (req, res) => {
    const { id } = req.params; // route_id
    console.log(`Fetching ordered stops for route id: ${id}`);
    
    try {
        // Lấy tất cả các liên kết cho route này
        const [routeLinks] = await pool.execute(
            'SELECT stop_current_id, stop_next_id FROM route_stop WHERE route_id = ?',
            [id]
        );

        if (routeLinks.length === 0) {
            return res.status(200).json({ message: 'ok', data: [] });
        }

        // Lấy thông tin chi tiết (bao gồm lat, lng) của TẤT CẢ các trạm dừng
        const [allStops] = await pool.execute(
            'SELECT stop_id, name, address, lat, lng FROM stop'
        );

        // Chuyển allStops thành một map để tra cứu O(1)
        const stopsMap = allStops.reduce((acc, stop) => {
            acc[stop.stop_id] = stop;
            return acc;
        }, {});

        // --- Logic sắp xếp các trạm theo đúng thứ tự ---
        const orderedWaypoints = [];
        const linkMap = routeLinks.reduce((acc, link) => {
            acc[link.stop_current_id] = link.stop_next_id;
            return acc;
        }, {});
        
        // Tìm trạm đầu tiên (trạm không phải là 'stop_next_id' của bất kỳ trạm nào khác)
        const nextStops = new Set(routeLinks.map(l => l.stop_next_id));
        let firstStopId = routeLinks.find(l => !nextStops.has(l.stop_current_id))?.stop_current_id;

        // Xử lý nếu là tuyến vòng (không tìm thấy trạm đầu)
        if (!firstStopId) {
            firstStopId = routeLinks[0].stop_current_id;
        }

        let currentStopId = firstStopId;
        
        // Lặp qua danh sách liên kết để tạo mảng waypoints
        for (let i = 0; i < routeLinks.length + 1; i++) {
            if (!currentStopId || !stopsMap[currentStopId]) {
                break; // Dừng lại nếu không tìm thấy trạm (tránh lặp vô hạn)
            }

            const stopInfo = stopsMap[currentStopId];
            orderedWaypoints.push({
                name: stopInfo.name,
                address: stopInfo.address,
                // Chuyển đổi lat/lng thành mảng [lat, lng]
                coords: [parseFloat(stopInfo.lat), parseFloat(stopInfo.lng)] 
            });

            currentStopId = linkMap[currentStopId]; // Di chuyển đến trạm tiếp theo
            if (!currentStopId) break; // Hết tuyến
        }
        // --- Kết thúc logic sắp xếp ---

        return res.status(200).json({ message: 'ok', data: orderedWaypoints });

    } catch (err) {
        console.error(`Error in getStopsByRouteId (id: ${id}):`, err);
        return res.status(500).json({ message: err.message });
    }
};

let addStopToRoute = async (req, res) => {
    const { route_id, stop_current_id, stop_next_id } = req.body;
    console.log('Adding stop link to route:', req.body);

    // 1. Kiểm tra dữ liệu đầu vào
    if (!route_id || !stop_current_id || !stop_next_id) {
        return res.status(400).json({ 
            message: 'Missing required fields: route_id, stop_current_id, stop_next_id' 
        });
    }

    // 2. (Tùy chọn) Kiểm tra xem 2 trạm có trùng nhau không
    if (stop_current_id === stop_next_id) {
        return res.status(400).json({
            message: 'Current stop and next stop cannot be the same'
        });
    }

    try {
        // 3. Thực thi INSERT
        const [result] = await pool.execute(
            'INSERT INTO route_stop (route_id, stop_current_id, stop_next_id) VALUES (?, ?, ?)', 
            [route_id, stop_current_id, stop_next_id]
        );

        if (result.affectedRows === 0) {
            // Trường hợp này hiếm khi xảy ra với INSERT, nhưng vẫn check
            return res.status(500).json({ message: 'Failed to add stop to route' });
        }

        return res.status(201).json({ message: 'Stop link added to route successfully' });

    } catch (err) {
        // 4. Bắt lỗi (quan trọng nhất)
        console.error('Error in addStopToRoute:', err);

        // Lỗi 1452: Không tìm thấy route_id hoặc stop_id (lỗi khóa ngoại)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ 
                message: 'Error: Route ID or Stop ID does not exist in database.' 
            });
        }
        // Lỗi 1062: Trùng lặp (ví dụ: đã thêm liên kết này rồi)
        if (err.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ 
                message: 'Error: This stop link (current -> next) already exists for this route.' 
            });
        }

        // Lỗi chung
        return res.status(500).json({ message: err.message });
    }
};

// Export tất cả hàm
export default {
    getAllRoutes,
    createRoute,
    deleteRoute,
    getAllStops,
    createStop,
    getStopsByRouteId,
    addStopToRoute
};