import { ICONS } from "../../config/ICONS.jsx";

//Truyền props các hàm vào.
const ButtonsAction = ({ onView, onEdit, onDelete, item }) => {

    const ActionView = ICONS.eye;
    const ActionEdit = ICONS.pencil;
    const ActionDelete = ICONS.cancel;

    return (
        <>
            <ActionView
                className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                size={18}
                onClick={() => onView(item)}
                title="Xem chi tiết"
            />

            {/* Edit Button */}
            <ActionEdit
                className="text-green-600 cursor-pointer hover:text-green-800 transition-colors"
                size={18}
                onClick={() => onEdit(item)}
                title="Chỉnh sửa"
            />

            {/* Delete Button */}
            <ActionDelete
                className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                size={18}
                onClick={() => onDelete(item)}
                title="Xóa"
            />
        </>
    );

};

export default ButtonsAction;