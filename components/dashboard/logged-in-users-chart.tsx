'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', users: 24 },
  { name: 'Tue', users: 32 },
  { name: 'Wed', users: 28 },
  { name: 'Thu', users: 35 },
  { name: 'Fri', users: 42 },
  { name: 'Sat', users: 18 },
  { name: 'Sun', users: 12 },
];

export function LoggedInUsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logged in Users</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}