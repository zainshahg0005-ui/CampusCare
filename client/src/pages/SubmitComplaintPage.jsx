import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  Wifi,
  Droplet,
  Building,
  Activity,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const categoryOptions = [
  { id: 'Electricity', label: 'Electricity & Power', icon: Zap, hint: 'Lights, sockets, lab power, AC' },
  { id: 'Internet/Wi-Fi', label: 'Network & Wi-Fi', icon: Wifi, hint: 'Hostel signal, Ethernet, router drop' },
  { id: 'Water Supply', label: 'Water & Plumbing', icon: Droplet, hint: 'Taps, dispensers, pressure, heaters' },
  { id: 'Washroom', label: 'Washroom & Sanitary', icon: Sparkles, hint: 'Hygiene, drains, fixtures' },
  { id: 'Laboratory', label: 'Lab & Heavy Equipment', icon: Activity, hint: 'Fume hoods, chemicals, gas lines' },
  { id: 'Classroom', label: 'Classroom & Facilities', icon: Building, hint: 'Desks, projectors, audio, doors' },
  { id: 'Other', label: 'General / Other', icon: HelpCircle, hint: 'Grounds, transport, general issues' },
];

const priorityLevels = [
  { id: 'Urgent', label: 'Urgent (Emergency)', sla: 'Technician dispatched in < 2 hrs', bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  { id: 'High', label: 'High Priority', sla: 'Response within 6 hrs', bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  { id: 'Medium', label: 'Standard / Medium', sla: 'Turnaround within 24 hrs', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
  { id: 'Low', label: 'Low / Routine', sla: 'Scheduled in weekly maintenance', bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
];

const SubmitComplaintPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('campuscare_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore error
      }
    }
    return {
      title: '',
      category: '',
      location: '',
      priority: 'Medium',
      description: '',
    };
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Persist draft to local storage
  useEffect(() => {
    localStorage.setItem('campuscare_draft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectCategory = (catId) => {
    setFormData((prev) => ({ ...prev, category: catId }));
  };

  const handleSelectPriority = (priorityId) => {
    setFormData((prev) => ({ ...prev, priority: priorityId }));
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please attach an image file (PNG, JPG, JPEG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo size must be less than 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
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

    const { title, category, location, priority, description } = formData;

    if (!title.trim() || !category || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields (Category, Title, Location, and Description).');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', title.trim());
      data.append('category', category);
      data.append('location', location.trim());
      data.append('priority', priority || 'Medium');
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
        // Clear draft
        localStorage.removeItem('campuscare_draft');
        setSuccess('Your complaint has been lodged with the facilities desk.');
        setTimeout(() => {
          navigate('/student/complaints');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      setError(
        err.response?.data?.message || 'Failed to submit grievance. Please verify server connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPriorityObj = priorityLevels.find((p) => p.id === formData.priority) || priorityLevels[2];

  return (
    <DashboardLayout
      title="Lodge Facility Complaint"
      subtitle="Report campus issues directly to university maintenance engineers"
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Alerts */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="dashboard-card" style={{ padding: '2rem' }}>
          {/* Step 1: Category Picker */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
              1. Select Facility Category <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {categoryOptions.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      borderRadius: 10,
                      border: isSelected ? '2px solid #09090b' : '1px solid #e4e4e7',
                      background: isSelected ? '#f4f4f5' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: isSelected ? '#09090b' : '#f4f4f5',
                        color: isSelected ? '#ffffff' : '#18181b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 4,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: isSelected ? '#09090b' : '#18181b' }}>
                      {cat.label}
                    </strong>
                    <span style={{ fontSize: '0.725rem', color: '#6b7280', lineHeight: 1.3 }}>
                      {cat.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Urgency / Priority Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                2. Urgency & Service Level Agreement
              </label>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: selectedPriorityObj.text,
                  background: selectedPriorityObj.bg,
                  border: `1px solid ${selectedPriorityObj.border}`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 6,
                }}
              >
                {selectedPriorityObj.sla}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {priorityLevels.map((p) => {
                const isSelected = formData.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPriority(p.id)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 10,
                      border: isSelected ? `2px solid ${p.text}` : '1px solid #e5e7eb',
                      background: isSelected ? p.bg : '#ffffff',
                      color: isSelected ? p.text : '#4b5563',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 550,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Specific Location & Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label" htmlFor="title">
                Incident Title <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="e.g. Wi-Fi router flashing red, dropping packets"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="location">
                Exact Location <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                placeholder="e.g. Hostel B, Room 314"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Step 4: Detailed Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="description" style={{ margin: 0 }}>
                Detailed Observation <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <span style={{ fontSize: '0.725rem', color: '#9ca3af' }}>
                {formData.description.length} characters
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe symptoms, when the issue began, whether it affects multiple students, etc."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Step 5: Photo Evidence Drag & Drop */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label">Attach Photo Evidence (Optional)</label>
            {!imagePreview ? (
              <div
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '2px dashed #059669' : '2px dashed #d1d5db',
                  background: isDragging ? '#ecfdf5' : '#f9fafb',
                  borderRadius: 14,
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => document.getElementById('image-upload-input').click()}
              >
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}
                >
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                  Click to browse or drag and drop photo
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  PNG, JPG, or WEBP up to 5MB
                </div>
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Upload Preview"
                  style={{ maxHeight: 220, display: 'block' }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/student/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 180 }}
            >
              <FilePlus2 size={18} />
              <span>{loading ? 'Submitting...' : 'Submit Grievance'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SubmitComplaintPage;
