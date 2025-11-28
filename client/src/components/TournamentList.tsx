import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Tournament {
    Id: number;
    Title: string;
    Date: string;
    Location: string;
    eventUuid?: string;
    EventUuid?: string; // API might return this capitalized
}

const TournamentList: React.FC = () => {
    const { user } = useAuth();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/tournaments')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch tournaments');
                return res.json();
            })
            .then(data => {
                setTournaments(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Tournament</h3>
            </div>
            <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            {user && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planning</th>}
                            {user && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execution</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tournaments.map((t) => (
                            <tr key={t.Id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.Id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.Title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.Date ? t.Date.substring(0, 10) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.Location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {(t.eventUuid || t.EventUuid) ? (
                                        <a href={`/event/${t.eventUuid || t.EventUuid}`} className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                                            Event
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                {user && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href={`/planning/${t.Id}`} className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded">Planning</a>
                                    </td>
                                )}
                                {user && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href={`/execution/${t.Id}/recent`} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Execution</a>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TournamentList;
