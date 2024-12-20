import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');

    // patient form related data
    const [showForm, setShowForm] = useState(false);
    const [newPatient, setNewPatient] = useState({
        patientId: 0,
        name: '',
        age: 0,
        gender: '',
        contactNumber: '',
        address: '',
    });

    const handleEdit = (patient) => {
        setNewPatient(patient); // Pre-fill the form with the selected patient
        setShowForm(true); // Show the form
    };
    
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:7190/api/Patients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Patients API Response:', response.data); // Debug here
                setPatients(response.data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to fetch patients.');
            }
        };
    
        fetchPatients();
    }, []);

    <div>
        <a href="/dashboard" className="back-link">Back to Dashboard</a>
    </div>

    return (
        <div className="list-container">
            <a href="/dashboard" className="back-link">Back to Dashboard</a>
            <h1 className="list-title">Patients List</h1>
            {localStorage.getItem('role') === 'Admin' && (
                <button
                    className="add-button"
                    onClick={() => {
                        setNewPatient({
                            patientId: 0,
                            name: '',
                            age: 0,
                            gender: '',
                            contactNumber: '',
                            address: '',
                        }); // Reset form values
                        setShowForm(true);
                    }}
                >Add Patient</button>
            )}
            {/* add a patient form */}
            {showForm && (
                <form
                    className="add-form"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const token = localStorage.getItem('token');
                            if (newPatient.patientId === 0) {
                                // Add Patient
                                await axios.post('https://localhost:7190/api/Patients', newPatient, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                setPatients([...patients, newPatient]);
                            } else {
                                // Update Patient
                                await axios.put(
                                    `https://localhost:7190/api/Patients/${newPatient.patientId}`,
                                    newPatient,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                setPatients(
                                    patients.map((p) =>
                                        p.patientId === newPatient.patientId ? newPatient : p
                                    )
                                );
                            }
                            setShowForm(false);
                        } catch (err) {
                            console.error('Error saving patient:', err);
                            setError('Failed to save patient.');
                        }
                    }}
                    
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={newPatient.age}
                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Gender"
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={newPatient.contactNumber}
                        onChange={(e) =>
                            setNewPatient({ ...newPatient, contactNumber: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={newPatient.address}
                        onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                        required
                    />
                    <button type="submit" className="submit-button">Save Patient</button>
                    <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                        Cancel
                    </button>
                </form>
            
            )}
            {/* display any error message */}
            {error && <p className="error-message">{error}</p>}
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.patientId}>
                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>
                                {localStorage.getItem('role') === 'Admin' && (
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(patient)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Patients;
