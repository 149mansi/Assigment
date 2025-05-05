
import { useSelector } from 'react-redux';
import { selectTodaysVisits } from '../features/visits/visitsSlice';
import { format, parseISO } from 'date-fns';

const VisitTable = () => {
  const visits = useSelector(selectTodaysVisits);

  const getVisitType = (phone, currentVisitTime) => {
    const customerVisits = visits
      .filter(v => v.mobileNo === phone)
      .sort((a, b) => parseISO(a.schedule) - parseISO(b.schedule));
    
    return parseISO(customerVisits[0].schedule).getTime() === parseISO(currentVisitTime).getTime() 
      ? 'First Time' 
      : 'Follow Up';
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visit Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visits.map((visit) => (
            <tr key={`${visit.mobileNo}-${visit.schedule}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{visit.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{visit.mobileNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {format(parseISO(visit.schedule), 'HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{visit.carModel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {visit.scorePercent.toString().replace('%', '')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  getVisitType(visit.mobileNo, visit.schedule) === 'First Time' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getVisitType(visit.mobileNo, visit.schedule)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitTable;