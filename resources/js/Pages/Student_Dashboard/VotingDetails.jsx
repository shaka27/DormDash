// resources/js/Pages/VotingCentre.jsx
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function VotingDetails({ vote }) {
  
  return (
    <StudentLayout>
      <Head title="Voting Centre" />

      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Voting Details Page for displaying a specific vote</h1>
      </div>
    </StudentLayout>
  );
}
