<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureResidenceSelected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user has Admin role
        $user = $request->user();
        if ($user) {
            $isAdmin = $user->roles()->where('description', 'Admin')->exists();

            // If admin and no residence selected, redirect to residence overview
            if ($isAdmin && !$request->session()->has('selected_residence_id')) {
                return redirect()->route('residence.overview');
            }
        }

        return $next($request);
    }
}
