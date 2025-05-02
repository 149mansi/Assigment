export default function VisitTypeBadge({ clientId, mobileNo, visits }) {
    // Find all visits for this client
    const clientVisits = visits.filter(v => v.mobileNo === mobileNo);
    
    // Sort by date to find first visit
    const sortedVisits = [...clientVisits].sort((a, b) => 
      new Date(a.schedule) - new Date(b.schedule)
    );
    
    const isFirstVisit = sortedVisits[0].id === clientId;
  
    return (
      <span className={`visit-badge ${isFirstVisit ? 'first-time' : 'follow-up'}`}>
        {isFirstVisit ? 'First Time' : 'Follow Up'}
      </span>
    );
  }