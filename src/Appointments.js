import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
    // States for managing appointments, patients, doctors, errors, and the form
    const [appointments, setAppointments] = useState([]); // For storing appointment list
    const [patients, setPatients] = useState([]); // For storing patient list
    const [doctors, setDoctors] = useState([]); // For storing doctor list
    const [error, setError] = useState(''); // For storing error messages
    const [showForm, setShowForm] = useState(false); // To toggle the appointment form

    // State for handling new appointment form values
    const [newAppointment, setNewAppointment] = useState({
        appointmentId: 0, // Default to 0 for new appointments
        reason: '', // To store the reason for the appointment
        appointmentDate: '', // To store the date of the appointment
        status: 'Scheduled', // Default status
        diagnosis: '', // To store diagnosis
        doctorId: '', // To store selected doctor's ID
        patientId: '', // To store selected patient's ID
    });


    // Fetch patients
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [patientsResponse, doctorsResponse] = await Promise.all([
                    axios.get('https://localhost:7190/api/Patients', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get('https://localhost:7190/api/Doctors', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);
                setPatients(patientsResponse.data);
                setDoctors(doctorsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);
    

    // Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:7190/api/Appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAppointments(response.data);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to fetch appointments.');
            }
        };

        fetchAppointments();
    }, []);

    // Handle Add button click
    const handleAddClick = () => {
        const doctorId = localStorage.getItem('role') === 'Admin' ? null : parseInt(localStorage.getItem('userNo'), 10);
        console.log('DoctorId being set:', doctorId); // Debugging
        setNewAppointment({
            appointmentId: 0,
            reason: '',
            appointmentDate: '',
            status: 'Scheduled',
            diagnosis: '',
            doctorId: doctorId,
            patientId: 0,
        });
        setShowForm(true);
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
    
            // Flatten the payload
            const payload = {
                appointmentId: newAppointment.appointmentId,
                reason: newAppointment.reason,
                appointmentDate: newAppointment.appointmentDate,
                status: newAppointment.status,
                diagnosis: newAppointment.diagnosis,
                doctorId: parseInt(newAppointment.doctorId, 10), // Convert to integer
                patientId: parseInt(newAppointment.patientId, 10), // Convert to integer
            };
    
            console.log('Final Payload:', payload); // Debug payload
            await axios.post('https://localhost:7190/api/Appointments', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Update appointments list and hide the form
            setAppointments([...appointments, payload]);
            setShowForm(false);
        } catch (err) {
            console.error('Error adding appointment:', err.response?.data || err.message);
            setError(err.response?.data?.errors || 'Failed to add appointment.');
        }
    };
    

    return (
        <div className="list-container">
            <a href="/dashboard" className="back-link">Back to Dashboard</a>
            <h1 className="list-title">Appointments List</h1>
            {/* Add Appointment Button */}
            {localStorage.getItem('role') === 'Admin' && (
                <button className="add-button" onClick={handleAddClick}>
                    Add Appointment
                </button>
            )}
            {/* Add Appointment Form */}
            {showForm && (
                <form className="add-form" onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Reason"
                        value={newAppointment.reason}
                        onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                        required
                    />
                    <input
                        type="datetime-local"
                        placeholder="Appointment Date"
                        value={newAppointment.appointmentDate}
                        onChange={(e) =>
                            setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })
                        }
                        required
                    />
                    <select
                        onChange={(e) => setNewAppointment({ ...newAppointment, patientId: parseInt(e.target.value, 10) })}
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                            <option key={patient.patientId} value={patient.patientId}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                        required>
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.doctorId} value={doctor.doctorId}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Diagnosis"
                        value={newAppointment.diagnosis}
                        onChange={(e) => setNewAppointment({ ...newAppointment, diagnosis: e.target.value })}
                    />
                    <button type="submit" className="submit-button">Save Appointment</button>
                    <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                        Cancel
                    </button>
                </form>
            )}

            {/* Error Handling */}
            {error && <p className="error-message">{error}</p>}
            {/* Appointments Table */}
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Diagnosis</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.appointmentId}>
                            <td>{appointment.reason}</td>
                            <td>{appointment.appointmentDate}</td>
                            <td>{appointment.status}</td>
                            <td>{appointment.diagnosis}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Appointments;
