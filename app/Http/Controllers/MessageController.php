<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $groups = Group::with('messages')->get();

        return inertia('Student_Dashboard/Messages', ['groups' => $groups]);
    }

    // TODO: Add CRUD methods for votes and message options
}
