<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Issues', [
            'issues' => Issue::with(['createdBy', 'assignedTo'])->get(),
            'users' => User::select(['id', 'name'])->get()
        ]);
    }

    public function indexDeveloper()
    {
        return Inertia::render('Developer/Issues', [
            'issues' => Issue::with(['createdBy', 'assignedTo'])
                ->where('assigned_to', auth()->id())
                ->get(),
        ]);
    }

    public function updateAssignee(Request $request)
{
    $validated = $request->validate([
        'assigned_to' => 'nullable|exists:users,id',
        'issue_id' => 'required|exists:issues,id'
    ]);

    $issue = Issue::find($validated['issue_id']);
    $issue->update([
        'assigned_to' => $validated['assigned_to']
    ]);

    return redirect()->back();
}

public function updateStatus(Request $request, Issue $issue)
{
    $validated = $request->validate([
        'status' => 'required|string|in:open,in_progress,resolved,closed',
    ]);

    $issue->update([
        'status' => $validated['status'],
    ]);

    return response()->json(['message' => 'Status updated successfully.']);
}

}
