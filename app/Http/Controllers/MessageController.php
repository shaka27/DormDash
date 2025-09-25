<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $groups = Group::with('messages')->get();

        return inertia('Student_Dashboard/Messages', ['groups' => $groups]);
    }
}
