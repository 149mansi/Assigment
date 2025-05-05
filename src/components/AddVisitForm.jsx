
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addVisit } from '../store/visitsSlice';

// export default function AddVisitForm() {
//   const dispatch = useDispatch();
//   const visits = useSelector(state => state.visits.visits);
//   const [form, setForm] = useState({ name: '', phone: '', time: '', vehicle: '', score: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newTime = new Date(`2025-05-02T${form.time}`);

//     // Check for duplicate phone
//     if (visits.find(v => v.phone === form.phone)) return setError('Duplicate phone number!');
    
//     // Check for overlapping time (within 1 hour = 3600000 ms)
//     if (visits.find(v => Math.abs(newTime - v.time) < 3600000)) return setError('Overlapping time!');

//     dispatch(addVisit({
//       ...form,
//       time: newTime,
//       score: parseInt(form.score),
//     }));

//     setForm({ name: '', phone: '', time: '', vehicle: '', score: '' });
//     setError('');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2 mb-4">
//       <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border px-2 py-1" />
//       <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border px-2 py-1" />
//       <input name="time" placeholder="Time (e.g., 11:30)" value={form.time} onChange={handleChange} className="border px-2 py-1" />
//       <input name="vehicle" placeholder="Vehicle" value={form.vehicle} onChange={handleChange} className="border px-2 py-1" />
//       <input name="score" placeholder="Score" value={form.score} onChange={handleChange} className="border px-2 py-1" />
//       {error && <div className="text-red-600">{error}</div>}
//       <button type="submit" className="bg-blue-600 text-white px-3 py-1">Add Visit</button>
//     </form>
//   );
// }
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisit, selectAllVisits } from '../features/visits/visitsSlice';
import { parseISO, addHours, isWithinInterval } from 'date-fns';

const AddVisitForm = () => {
  const dispatch = useDispatch();
  const allVisits = useSelector(selectAllVisits);
  
  const [formData, setFormData] = useState({
    clientName: '',
    mobileNo: '',
    schedule: '',
    carModel: '',
    scorePercent: '',
  });
  
  const [errors, setErrors] = useState({
    mobileNo: '',
    schedule: '',
    form: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate phone uniqueness (all visits, not just today's)
  const validatePhone = (phone) => {
    return !allVisits.some(visit => visit.mobileNo === phone);
  };

  // Validate time slot availability (1-hour appointments)
  const validateTime = (time) => {
    if (!time) return true;
    
    const newStart = parseISO(time);
    const newEnd = addHours(newStart, 1);
    
    return !allVisits.some(visit => {
      const visitStart = parseISO(visit.schedule);
      const visitEnd = addHours(visitStart, 1);
      return isWithinInterval(newStart, { start: visitStart, end: visitEnd }) ||
             isWithinInterval(newEnd, { start: visitStart, end: visitEnd });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const newErrors = { mobileNo: '', schedule: '', form: '' };

    if (!formData.clientName) {
      newErrors.form = 'Name is required';
      isValid = false;
    }

    if (!formData.mobileNo) {
      newErrors.mobileNo = 'Phone is required';
      isValid = false;
    } else if (!validatePhone(formData.mobileNo)) {
      newErrors.mobileNo = 'Phone number already exists';
      isValid = false;
    }

    if (!formData.schedule) {
      newErrors.schedule = 'Time is required';
      isValid = false;
    } else if (!validateTime(formData.schedule)) {
      newErrors.schedule = 'Time overlaps with existing visit';
      isValid = false;
    }

    if (!formData.carModel) {
      newErrors.form = 'Vehicle is required';
      isValid = false;
    }

    if (!formData.scorePercent) {
      newErrors.form = 'Score is required';
      isValid = false;
    } else if (formData.scorePercent < 0 || formData.scorePercent > 100) {
      newErrors.form = 'Score must be between 0-100';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (isValid) {
      dispatch(addVisit({
        ...formData,
        // Store score without % symbol
        scorePercent: formData.scorePercent.toString().replace('%', '')
      }));
      // Reset form
      setFormData({
        clientName: '',
        mobileNo: '',
        schedule: '',
        carModel: '',
        scorePercent: '',
      });
      setErrors({ mobileNo: '', schedule: '', form: '' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Visit</h2>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Customer name"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.mobileNo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="555-1234"
            />
            {errors.mobileNo && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
            )}
          </div>

          {/* Time Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="datetime-local"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.schedule ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
            )}
          </div>

          {/* Vehicle Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle *
            </label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Toyota Camry"
            />
          </div>

          {/* Score Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score (0-100) *
            </label>
            <input
              type="number"
              name="scorePercent"
              value={formData.scorePercent}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="85"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Visit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisitForm;