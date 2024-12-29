import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Spinner, Modal, Button, Form, Badge } from "react-bootstrap";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState({
    _id: "",
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    visibility: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8000/events", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            category: filterCategory,
            date: filterDate,
            visibility: filterVisibility,
          },
        });

        setEvents(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filterCategory, filterDate, filterVisibility]);

  const handleEditClick = (event) => {
    setEditEventData({
      _id: event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().split("T")[0],
      category: event.category,
      visibility: event.visibility,
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to edit an event");
      setIsSaving(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/edit-event/${editEventData._id}`,
        { token, ...editEventData }
      );

      if (response.status === 200) {
        setEvents(
          events.map((event) =>
            event._id === editEventData._id
              ? { ...event, ...editEventData }
              : event
          )
        );
        alert("Event updated successfully");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to delete an event");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setEvents(events.filter((event) => event._id !== eventId));
        alert("Event deleted successfully");
      } else {
        alert(response.data.message || "Failed to delete the event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <div className="container">
          <h1 className="text-center mb-4">Event Dashboard</h1>

          <div className="d-flex justify-content-between mb-4">
            <div className="filter-container">
              <select
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select mb-2"
              >
                <option value="">All Categories</option>
                <option value="tech">Tech</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="form-control mb-2"
              />
              <select
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="form-select"
              >
                <option value="">All Events</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <Link to="/addEvent" className="btn btn-primary align-self-start">
              Add Event
            </Link>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="row">
              {events.map((event) => (
                <div className="col-md-4 mb-4" key={event._id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text">
                        <Badge bg="info" className="me-2">
                          {event.category}
                        </Badge>
                        <Badge bg="secondary">{event.visibility}</Badge>
                        <br />
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="card-text text-muted">
                        {event.description}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.title}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editEventData.description}
                onChange={(e) =>
                  setEditEventData({
                    ...editEventData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.location}
                onChange={(e) =>
                  setEditEventData({
                    ...editEventData,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editEventData.date}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.category}
                onChange={(e) =>
                  setEditEventData({
                    ...editEventData,
                    category: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventVisibility">
              <Form.Label>Visibility</Form.Label>
              <Form.Control
                as="select"
                value={editEventData.visibility}
                onChange={(e) =>
                  setEditEventData({
                    ...editEventData,
                    visibility: e.target.value,
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Event;
