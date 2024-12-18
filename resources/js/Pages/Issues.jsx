import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

// Mock data

export default function Issues({ auth, issues, users }) {
    const handleAssigneeChange = (issueId, userId) => {
        axios
            .post(route('issues.update-assignee'), {
                assigned_to: userId,
                issue_id: issueId,
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating assignee:', error);
            });
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
                                                <div className="flex items-center gap-2">
                                                    {issue.assigned_to ? (
                                                        <img
                                                            src={
                                                                issue
                                                                    .assigned_to
                                                                    .avatar
                                                            }
                                                            alt=""
                                                            className="h-6 w-6 rounded-full bg-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                                                            <svg
                                                                className="h-4 w-4 text-gray-400"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <select
                                                        value={
                                                            issue.assigned_to
                                                                ?.id ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            handleAssigneeChange(
                                                                issue.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    >
                                                        <option value="">
                                                            Unassigned
                                                        </option>
                                                        {users.map((user) => (
                                                            <option
                                                                key={user.id}
                                                                value={user.id}
                                                            >
                                                                {user.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
