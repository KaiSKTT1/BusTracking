import React, { useState } from "react";
import StudentInfoCard from "../../components/card/StudentInfoCard";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parentInfo = {
    name: "Parent",
    email: "parent@gmail.com",
    phone: "0901234567",
    address: "TP. HCM",
  };

  const studentsList = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Parent Information
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {parentInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {parentInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> {parentInfo.phone}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Details & Change Password
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Student List ({studentsList.length})
          </h2>
          <div className="space-y-6">
            {studentsList.map((student) => (
              <StudentInfoCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6">Parent Profile</h2>

            {/* Thông tin chi tiết */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                Detailed Information
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {parentInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {parentInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {parentInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {parentInfo.address}
                </p>
              </div>
            </div>

            {/* Đổi Mật khẩu */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                Change Password
              </h3>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
