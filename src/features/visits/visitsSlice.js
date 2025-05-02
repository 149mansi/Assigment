import { createSlice } from '@reduxjs/toolkit';
import visitsData from './visitsData.json';

const initialState = {
  visits: visitsData.map(visit => ({
    ...visit,
    schedule: new Date(visit.schedule),
    scorePercent: parseInt(visit.scorePercent),
  })),
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: (state, action) => {
      state.visits.push({
        ...action.payload,
        schedule: new Date(action.payload.schedule),
        scorePercent: parseInt(action.payload.scorePercent),
      });
    },
  },
});

export const { addVisit } = visitsSlice.actions;

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

export const selectVisitsByPhone = (state, phone) => {
  return state.visits.visits.filter(visit => visit.mobileNo === phone);
};

export default visitsSlice.reducer;