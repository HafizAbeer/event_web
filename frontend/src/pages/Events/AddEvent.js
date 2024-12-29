import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !location || !description || !date || !category) {
      alert("All fields are required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/create",
        { title, location, description, date, category, visibility, token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        navigate("/event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center text-primary mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Event Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Event Description</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe your event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="tech">Tech</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Visibility</label>
            <select
              className="form-select"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: "linear-gradient(90deg, #007bff, #00d4ff)",
                border: "none",
              }}
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
