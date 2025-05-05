// features/visits/visitsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import visitsData from './visitsData.json';

// Helper function to normalize visit data
const normalizeVisit = (visit) => ({
  ...visit,
  schedule: new Date(visit.schedule),
  scorePercent: parseInt(visit.scorePercent.replace('%', '')) || 0,
  id: `${visit.mobileNo}-${visit.schedule}` // Add unique ID
});

const initialState = {
  visits: visitsData.map(normalizeVisit),
  status: 'idle',
  error: null
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: {
      reducer: (state, action) => {
        state.visits.push(normalizeVisit(action.payload));
      },
      prepare: (visit) => ({
        payload: {
          ...visit,
          schedule: visit.schedule || new Date().toISOString() // Default to now if empty
        }
      })
    }
  }
});

// Selectors
export const selectAllVisits = state => state.visits.visits;

export const selectTodaysVisits = state => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return state.visits.visits.filter(visit => {
    const visitDate = new Date(visit.schedule);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate.getTime() === today.getTime();
  });
};

export const selectVisitsByPhone = (state, phone) => 
  state.visits.visits.filter(visit => visit.mobileNo === phone);

export const selectVisitConflicts = (state, { mobileNo, schedule, durationHours = 1 }) => {
  if (!schedule) return [];
  
  const newStart = new Date(schedule);
  const newEnd = new Date(newStart.getTime() + durationHours * 60 * 60 * 1000);
  
  return state.visits.visits.filter(visit => {
    // Skip checking against itself if editing
    if (visit.mobileNo === mobileNo && visit.schedule === schedule) return false;
    
    const visitStart = new Date(visit.schedule);
    const visitEnd = new Date(visitStart.getTime() + durationHours * 60 * 60 * 1000);
    
    return (
      (newStart >= visitStart && newStart < visitEnd) ||
      (newEnd > visitStart && newEnd <= visitEnd) ||
      (newStart <= visitStart && newEnd >= visitEnd)
    );
  });
};

export const { addVisit } = visitsSlice.actions;
export default visitsSlice.reducer;