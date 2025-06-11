import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const administrations = [
  {
    user: 'Sarah Johnson',
    schedule: 'Tomorrow 9:00 AM',
    task: 'Monthly Reconciliation',
    status: 'Open'
  },
  {
    user: 'Mike Chen',
    schedule: 'Today 2:00 PM',
    task: 'Invoice Processing',
    status: 'Ongoing'
  },
  {
    user: 'Emma Davis',
    schedule: 'Yesterday 3:00 PM',
    task: 'Tax Preparation',
    status: 'Done'
  },
  {
    user: 'John Smith',
    schedule: 'Tomorrow 11:00 AM',
    task: 'Bank Reconciliation',
    status: 'Open'
  }
];

export function PlannedAdministrations() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4" />;
      case 'Ongoing':
        return <Clock className="w-4 h-4" />;
      case 'Done':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-orange-100 text-orange-800';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Planned Administrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {administrations.map((admin, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{admin.user}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {admin.schedule}
                </div>
                <div className="text-sm font-medium">
                  {admin.task}
                </div>
              </div>
              <Badge className={`flex items-center space-x-1 ${getStatusColor(admin.status)}`}>
                {getStatusIcon(admin.status)}
                <span>{admin.status}</span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}