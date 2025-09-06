import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { bannerService } from '../../services/bannerService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    image: null
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getBanners();
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('isActive', formData.isActive);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      await bannerService.uploadBanner(form);
      toast.success('Banner added successfully');
      setShowAddModal(false);
      setFormData({ title: '', description: '', isActive: true, image: null });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to add banner');
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    
    try {
      await bannerService.updateBanner(selectedBanner._id, {
        title: formData.title,
        description: formData.description,
        isActive: formData.isActive
      });
      toast.success('Banner updated successfully');
      setShowEditModal(false);
      setSelectedBanner(null);
      setFormData({ title: '', description: '', isActive: true, image: null });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update banner');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerService.deleteBanner(bannerId);
        toast.success('Banner deleted successfully');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const openEditModal = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      isActive: banner.isActive !== false,
      image: null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', isActive: true, image: null });
    setSelectedBanner(null);
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600">Manage app banners and promotional content</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          banners.map((banner) => (
            <div key={banner._id || banner.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Banner Image */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Banner Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {banner.title || 'Untitled Banner'}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    banner.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {banner.description || 'No description'}
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  {banner.created_at ? format(new Date(banner.created_at), 'MMM dd, yyyy') : 'Unknown date'}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner._id || banner.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Banner Modal */}
      <Modal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Banner"
      >
        <form onSubmit={handleAddBanner} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Banner
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Banner Modal */}
      <Modal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Banner"
      >
        <form onSubmit={handleUpdateBanner} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="editIsActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Banner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Banners;