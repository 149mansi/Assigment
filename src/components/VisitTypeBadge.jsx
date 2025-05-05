export default function VisitTypeBadge({ mobileNo, currentVisitTime, visits }) {
  // Find and sort all visits for this customer
  const customerVisits = visits
      .filter(visit => visit.mobileNo === mobileNo)
      .sort((a, b) => new Date(a.schedule) - new Date(b.schedule));

  // Safely determine if this is the first visit
  const isFirstVisit = customerVisits.length > 0 && 
                      new Date(customerVisits[0].schedule).getTime() === new Date(currentVisitTime).getTime();

  return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isFirstVisit 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
      }`}>
          {isFirstVisit ? 'First Time' : 'Follow Up'}
      </span>
  );
}