<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DialysisStep;

class DialysisStepController extends Controller
{
    // Lister les étapes de dialyse d'un patient
    public function index($patientId)
    {
        return response()->json(
            DialysisStep::where('patient_id', $patientId)->get()
        );
    }

    // Enregistrer une séance de dialyse
    public function store(Request $request, $patientId)
    {
        $validated = $request->validate([
            'type' => 'required|in:Hémodialyse,Dialyse péritonéale',
            'start_time' => 'required|date',
            'duration_minutes' => 'required|integer',
            'parameters' => 'required|json'
        ]);

        $step = DialysisStep::create([
            'patient_id' => $patientId,
            ...$validated
        ]);

        return response()->json($step, 201);
    }
}
