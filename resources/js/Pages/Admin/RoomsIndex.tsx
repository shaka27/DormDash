import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from '../Student_Dashboard/StudentLayout';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Residence {
  id: number;
  name: string;
  campus?: { id: number; name: string } | null;
}

interface Room {
  id: number;
  number: number | string;
  floor?: number | null;
  status?: string | null;
  capacity?: number | null;
  residence: Residence;
  users: User[];
}

export default function RoomsIndex() {
  const { rooms, residence } = (usePage().props as any) as { rooms: Room[]; residence: Residence };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <StudentLayout>
      <Head title="Rooms" />

      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Rooms in {residence.name}</h1>
            {residence.campus?.name && (
              <p className="text-gray-600 mt-2">Campus: {residence.campus.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        {rooms.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No rooms found for this residence.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">Room {room.number}</h3>
                  <p className="text-xs text-gray-500">Floor {room.floor ?? '—'}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(room.status)}`}>
                  {room.status ?? 'Unknown'}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <p>Capacity: {room.capacity ?? '—'}</p>
                <p>Occupants: {room.users.length}</p>
                <div className="mt-2 space-y-1">
                  {room.users.map(u => (
                    <div key={u.id} className="flex items-center justify-between text-xs text-gray-600">
                      <span>{u.first_name} {u.last_name}</span>
                      <span className="text-gray-400">{u.email}</span>
                    </div>
                  ))}
                  {room.users.length === 0 && (
                    <div className="text-xs text-gray-400">No occupants</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </StudentLayout>
  );
}