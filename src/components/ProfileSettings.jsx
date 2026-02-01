import { useState, useEffect } from 'react';
import { compressImage, validateCustomTips } from '../utils/profile-storage';
import './ProfileSettings.css';

function ProfileSettings({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    profileImage: profile.profileImage || null,
    customTips: profile.customTips || [1, 5, 10]
  });
  const [imagePreview, setImagePreview] = useState(profile.profileImage);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCustomTipChange = (index, value) => {
    const newTips = [...formData.customTips];
    newTips[index] = value;
    setFormData(prev => ({ ...prev, customTips: newTips }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
      return;
    }

    setUploading(true);
    try {
      const compressedImage = await compressImage(file, 400, 0.8);
      setFormData(prev => ({ ...prev, profileImage: compressedImage }));
      setImagePreview(compressedImage);
      setErrors(prev => ({ ...prev, image: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (!validateCustomTips(formData.customTips)) {
      newErrors.customTips = 'All tip amounts must be valid numbers between 0 and 10000';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Picture */}
          <div className="form-section">
            <label className="form-label">Profile Picture</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Profile" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">
                  <span className="placeholder-icon">📷</span>
                  <p>No image selected</p>
                </div>
              )}
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="profile-image" className="btn-upload">
                {uploading ? 'Uploading...' : 'Choose Image'}
              </label>
              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>
          </div>

          {/* Name */}
          <div className="form-section">
            <label className="form-label" htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
              maxLength={50}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Bio */}
          <div className="form-section">
            <label className="form-label" htmlFor="bio">
              Bio
              <span className="char-count">{formData.bio.length}/500</span>
            </label>
            <textarea
              id="bio"
              className="form-textarea"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell supporters about yourself..."
              maxLength={500}
              rows={4}
            />
            {errors.bio && <p className="error-text">{errors.bio}</p>}
          </div>

          {/* Custom Tip Amounts */}
          <div className="form-section">
            <label className="form-label">Quick Tip Amounts (XLM)</label>
            <div className="custom-tips-inputs">
              {formData.customTips.map((tip, index) => (
                <input
                  key={index}
                  type="number"
                  className="form-input tip-input"
                  value={tip}
                  onChange={(e) => handleCustomTipChange(index, e.target.value)}
                  min="0.01"
                  step="0.01"
                  max="10000"
                />
              ))}
            </div>
            {errors.customTips && <p className="error-text">{errors.customTips}</p>}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
