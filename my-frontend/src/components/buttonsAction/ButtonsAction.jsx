import { ICONS } from "../../config/ICONS.jsx";

//Truyền props các hàm vào.
const ButtonsAction = ({ onView, onEdit, onDelete, item }) => {

    const ActionView = ICONS.eye;
    const ActionEdit = ICONS.pencil;
    const ActionDelete = ICONS.cancel;

    return (
        <div className="flex items-center gap-3">
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
        </div>
    );

};

export default ButtonsAction;