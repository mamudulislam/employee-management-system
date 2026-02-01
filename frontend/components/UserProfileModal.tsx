import React, { useState } from 'react';
import { X, Edit2, Save, Camera } from 'lucide-react';
import { User } from '../types';
import { LoadingButton } from './Loading';

interface UserProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedUser: Partial<User>) => Promise<void>;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!onSave) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editedUser);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 flex items-center justify-between text-white">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <img
                src={editedUser.avatar}
                alt={editedUser.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-lg shadow-lg text-white hover:bg-indigo-700 transition-colors group-hover:block hidden">
                  <Camera size={16} />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{editedUser.name}</h3>
            <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg mt-2 uppercase tracking-wider">
              {editedUser.role}
            </p>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              ) : (
                <p className="text-sm text-slate-700 font-medium">{editedUser.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ID
              </label>
              <p className="text-sm text-slate-700 font-medium">{editedUser.id}</p>
            </div>

            {editedUser.department && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Department
                </label>
                <p className="text-sm text-slate-700 font-medium">{editedUser.department}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <LoadingButton
                  onClick={handleSave}
                  isLoading={isSaving}
                  spinnerColor="white"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Save size={16} />
                  Save
                </LoadingButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
