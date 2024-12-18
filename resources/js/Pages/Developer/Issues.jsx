import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

// Mock data

export default function Issues({ auth, issues: initialIssues }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [status, setStatus] = useState('');
    const [issues, setIssues] = useState(initialIssues);

    const openModal = (issue) => {
        setSelectedIssue(issue);
        setStatus(issue.status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIssue(null);
    };

    const handleStatusChange = async () => {
        try {
            await axios.patch(`/issues/${selectedIssue.id}/status`, {
                status: status,
            });
            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue.id === selectedIssue.id
                        ? { ...issue, status: status }
                        : issue,
                ),
            );
            closeModal();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            open: 'bg-slate-100 text-slate-800',
            in_progress: 'bg-blue-100 text-blue-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Issues" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-24 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Reference
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Reporter
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Assignee
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Created
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {issues.map((issue) => (
                                        <tr
                                            key={issue.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                                                {issue.reference_id}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                {issue.title}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                {issue.created_by.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                You
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeColor(issue.status)}`}
                                                >
                                                    {issue.status.replace(
                                                        /_/g,
                                                        ' ',
                                                    )}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                {formatDistanceToNow(
                                                    issue.created_at,
                                                    { addSuffix: true },
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <button
                                                    onClick={() =>
                                                        openModal(issue)
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal show={isModalOpen} onClose={closeModal}>
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">
                            {selectedIssue?.title}
                        </h2>
                        <p>
                            <strong>Reference:</strong>{' '}
                            {selectedIssue?.reference_id}
                        </p>
                        <p>
                            <strong>Reporter:</strong>{' '}
                            {selectedIssue?.created_by.name}
                        </p>
                        <p>
                            <strong>Status:</strong>{' '}
                            {selectedIssue?.status.replace(/_/g, ' ')}
                        </p>
                        <p>
                            <strong>Created:</strong>{' '}
                            {formatDistanceToNow(selectedIssue?.created_at, {
                                addSuffix: true,
                            })}
                        </p>
                        <div className="mt-4">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Change Status:
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <button
                            onClick={handleStatusChange}
                            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
