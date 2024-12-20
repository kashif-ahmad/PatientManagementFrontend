import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');

    // add doctor form
    const [newDoctor, setNewDoctor] = useState({
        doctorId: 0,
        name: '',
        specialization: '',
        phone: '',
        email: '',
    });
    const [showForm, setShowForm] = useState(false);

    // edit a doctor record
    const handleEdit = (doctor) => {
        setNewDoctor(doctor); // Pre-fill the form with the selected doctor's details
        setShowForm(true); // Show the form
    };

    // fetch doctor information
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:7190/api/Doctors', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to fetch doctors.');
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="list-container">
        <a href="/dashboard" className="back-link">Back to Dashboard</a>
        <h1 className="list-title">Doctors List</h1>
        {localStorage.getItem('role') === 'Admin' && (
            <button
                className="add-button"
                onClick={() => {
                    setNewDoctor({
                        doctorId: 0,
                        name: '',
                        specialization: '',
                        phone: '',
                        email: '',
                    }); // Reset form values
                    setShowForm(true); // Show form
                }}
            >
                Add Doctor
            </button>
        )}
        {/* add a Doctor form */}
        {showForm && (
            <form
                className="add-form"
                onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        const token = localStorage.getItem('token');
                        if (newDoctor.doctorId === 0) {
                            // Add Doctor
                            await axios.post('https://localhost:7190/api/Doctors', newDoctor, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            setDoctors([...doctors, newDoctor]);
                        } else {
                            // Update Doctor
                            await axios.put(
                                `https://localhost:7190/api/Doctors/${newDoctor.doctorId}`,
                                newDoctor,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setDoctors(
                                doctors.map((d) =>
                                    d.doctorId === newDoctor.doctorId ? newDoctor : d
                                )
                            );
                        }
                        setShowForm(false); // Hide form after submission
                    } catch (err) {
                        console.error('Error saving doctor:', err);
                        setError('Failed to save doctor.');
                    }
                }}
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Specialization"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    required
                />
                <button type="submit" className="submit-button">Save Doctor</button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                    Cancel
                </button>
            </form>
        )}
        {/* error handling  */}
        {error && <p className="error-message">{error}</p>}
        <table className="list-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Email</th>
                    {localStorage.getItem('role') === 'Admin' && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {doctors.map((doctor) => (
                    <tr key={doctor.doctorId}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.email}</td>
                        {localStorage.getItem('role') === 'Admin' && (
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(doctor)}
                                >
                                    Edit
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    );
};

export default Doctors;
