import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  Tag,
  MapPin,
  FileText,
  Image,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const categories = [
  'Classroom',
  'Laboratory',
  'Internet/Wi-Fi',
  'Washroom',
  'Electricity',
  'Water Supply',
  'Other',
];

const SubmitComplaintPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { title, category, location, description } = formData;

    if (!title.trim() || !category || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', title.trim());
      data.append('category', category);
      data.append('location', location.trim());
      data.append('description', description.trim());
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await api.post('/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        setSuccess('Complaint lodged successfully! Campus staff has been notified.');
        // Clear form
        setFormData({
          title: '',
          category: '',
          location: '',
          description: '',
        });
        removeImage();

        // Redirect to My Complaints after brief pause
        setTimeout(() => {
          navigate('/student/complaints');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Submit a Complaint"
      subtitle="Report an issue or maintenance requirement to campus authorities"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Complaint Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Complaint Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="Brief summary of the issue (e.g. Projector malfunctioning in Room 301)"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Tag size={18} className="input-icon" />
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location / Building <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Science Complex, 2nd Floor"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Detailed Problem Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Provide specific details so maintenance staff can bring the right tools (e.g. Power outlet sparking when laptop plugged in, no signal from Wi-Fi router CC-5G-East)"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              ></textarea>
            </div>

            {/* Optional Image Upload */}
            <div className="form-group">
              <label className="form-label">
                Photo Evidence <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span>
              </label>

              {!imagePreview ? (
                <div
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                  <UploadCloud size={36} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}>
                    Click or drag & drop a photo of the problem
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>PNG, JPG, JPEG, WEBP up to 5MB</p>
                </div>
              ) : (
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    style={{ maxHeight: '200px', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Remove attached photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/student/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                    <span>Lodging Complaint...</span>
                  </>
                ) : (
                  <>
                    <FilePlus2 size={18} />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubmitComplaintPage;
