
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
import { format, parseISO, addHours } from 'date-fns';

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { mobileNo: '', schedule: '' };

    // Check for duplicate phone
    const phoneExists = allVisits.some(visit => visit.mobileNo === formData.mobileNo);
    if (phoneExists) {
      newErrors.mobileNo = 'This phone number already exists';
      isValid = false;
    }

    // Check for overlapping time
    if (formData.schedule) {
      const newVisitStart = parseISO(formData.schedule);
      const newVisitEnd = addHours(newVisitStart, 1);
      
      const hasOverlap = allVisits.some(visit => {
        const visitStart = new Date(visit.schedule);
        const visitEnd = addHours(visitStart, 1);
        
        return newVisitStart < visitEnd && newVisitEnd > visitStart;
      });

      if (hasOverlap) {
        newErrors.schedule = 'This time overlaps with an existing visit';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(addVisit(formData));
      setFormData({
        clientName: '',
        mobileNo: '',
        schedule: '',
        carModel: '',
        scorePercent: '',
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-medium mb-4">Add New Visit</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.mobileNo && <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="datetime-local"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.schedule && <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Score (%)</label>
            <input
              type="number"
              name="scorePercent"
              value={formData.scorePercent}
              onChange={handleChange}
              min="0"
              max="100"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Visit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisitForm;