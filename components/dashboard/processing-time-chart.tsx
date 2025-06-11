'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', tagging: 2.4, booking: 1.8, bankMatching: 3.2 },
  { name: 'Feb', tagging: 2.1, booking: 1.9, bankMatching: 2.8 },
  { name: 'Mar', tagging: 2.8, booking: 2.2, bankMatching: 3.5 },
  { name: 'Apr', tagging: 2.3, booking: 1.7, bankMatching: 2.9 },
  { name: 'May', tagging: 2.6, booking: 2.0, bankMatching: 3.1 },
  { name: 'Jun', tagging: 2.2, booking: 1.8, bankMatching: 2.7 },
];

export function ProcessingTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Time (Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="tagging" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Tagging"
            />
            <Line 
              type="monotone" 
              dataKey="booking" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Booking"
            />
            <Line 
              type="monotone" 
              dataKey="bankMatching" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Bank Matching"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}