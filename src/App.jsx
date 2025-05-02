import './App.css';
import VisitTypeBadge from './components/VisitTypeBadge';

function App() {
  // Sample data
  const visits = [
    {
      id: 1,
      clientName: "Alice Johnson",
      mobileNo: "555-1234",
      schedule: "2025-05-02T10:00:00",
      carModel: "Toyota Camry",
      scorePercent: 92
    },
    {
      id: 2,
      clientName: "Bob Smith",
      mobileNo: "555-5678",
      schedule: "2025-05-02T10:30:00",
      carModel: "Honda Civic",
      scorePercent: 88
    },
    {
      id: 3,
      clientName: "Alice Johnson",
      mobileNo: "555-1234",
      schedule: "2025-05-02T14:00:00",
      carModel: "Toyota Camry",
      scorePercent: 85
    },
    {
      id: 4,
      clientName: "John Doe",
      mobileNo: "555-9999",
      schedule: "2025-05-03T09:00:00",
      carModel: "Ford Focus",
      scorePercent: 90
    }
  ];

  // Filter today's visits (2025-05-02)
  const todaysVisits = visits.filter(visit => 
    visit.schedule.startsWith("2025-05-02")
  );

  // Format schedule to show time only
  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="app-container">
      <h1>Client Visits</h1>
      <table className="visits-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Mobile No</th>
            <th>Schedule</th>
            <th>Car Model</th>
            <th>Score %</th>
            <th>Visit Type</th>
          </tr>
        </thead>
        <tbody>
          {todaysVisits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.clientName}</td>
              <td>{visit.mobileNo}</td>
              <td>{formatTime(visit.schedule)}</td>
              <td>{visit.carModel}</td>
              <td className={`score-${Math.floor(visit.scorePercent/10)}0`}>
                {visit.scorePercent}%
              </td>
              <td>
                <VisitTypeBadge 
                  clientId={visit.id} 
                  mobileNo={visit.mobileNo} 
                  visits={visits} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;