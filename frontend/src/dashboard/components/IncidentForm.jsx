import { useState, useEffect } from "react";
import "./IncidentForm.css";

export default function IncidentForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    type: "",
    description: "",
    details: "",
    latitude: "",
    longitude: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [islocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Location error:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.type || !form.latitude) {
      alert("Please wait for location to load.");
      return;
    }
    
    onSubmit({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      image: imagePreview,
      timestamp: new Date().toLocaleTimeString()
    });
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="incident-form-card">
        <div className="form-header">
          <h3>Report New Issue</h3>
          {islocating && <span className="locating-tag">📍 Locating...</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <select required value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
            <option value="">Select Category</option>
            <option value="Accident">Accident</option>
            <option value="Fire">Fire</option>
            <option value="Road Block">Road Block</option>
            <option value="Medical">Medical Hazard</option>
          </select>

          <input 
            type="text" 
            placeholder="What is the issue?" 
            required
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})} 
          />

          <div className="coord-display">
            <div className="coord-box">Lat: {form.latitude || '---'}</div>
            <div className="coord-box">Lng: {form.longitude || '---'}</div>
          </div>

          <div className="file-upload">
            <label className="photo-label">
              📸 {imagePreview ? "Change Photo" : "Take/Upload Photo"}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} hidden />
            </label>
            {imagePreview && <img src={imagePreview} className="preview-thumb" alt="preview" />}
          </div>

          {/* THIS SECTION MUST BE INSIDE THE CARD */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={islocating}>
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}