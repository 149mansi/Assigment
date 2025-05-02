
import { useSelector } from 'react-redux';
import { selectTodaysVisits } from '../features/visits/visitsSlice';
import { format } from 'date-fns';
import VisitTypeBadge from './VisitTypeBadge';

const VisitTable = () => {
  const visits = useSelector(selectTodaysVisits);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visits.map((visit) => (
            <tr key={`${visit.mobileNo}-${visit.schedule}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.mobileNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(visit.schedule), 'HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.carModel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.scorePercent}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <VisitTypeBadge phone={visit.mobileNo} currentVisitTime={visit.schedule} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitTable;