/**
 * Format date thành DD-MM-YYYY
 * @param {string|Date} dateValue - Giá trị date cần format
 * @returns {string} - Date đã format hoặc empty string
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return "";
    
    const date = new Date(dateValue);
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
};

/**
 * Format date thành DD/MM/YYYY
 * @param {string|Date} dateValue - Giá trị date cần format
 * @returns {string} - Date đã format hoặc empty string
 */
export const formatDateSlash = (dateValue) => {
    if (!dateValue) return "";
    
    const date = new Date(dateValue);
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

/**
 * Format date thành YYYY-MM-DD (cho input type="date")
 * @param {string|Date} dateValue - Giá trị date cần format
 * @returns {string} - Date đã format hoặc empty string
 */
export const formatDateISO = (dateValue) => {
    if (!dateValue) return "";
    
    const date = new Date(dateValue);
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) return "";
    
    return date.toISOString().split('T')[0];
};
