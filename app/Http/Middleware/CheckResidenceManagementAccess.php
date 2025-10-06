<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckResidenceManagementAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Load roles if not already loaded
        if (!$user->relationLoaded('roles')) {
            $user->load('roles');
        }

        // Check if user has one of the required roles
        $allowedRoles = ['Admin', 'HouseParent', 'HouseCommittee'];
        $userRoles = $user->roles->pluck('description')->toArray();

        $hasAccess = count(array_intersect($allowedRoles, $userRoles)) > 0;

        if (!$hasAccess) {
            abort(403, 'Unauthorized access. This page is only available to Admin, HouseParent, and HouseCommittee members.');
        }

        return $next($request);
    }
}
