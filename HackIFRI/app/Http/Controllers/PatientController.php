<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\AdministrativeData;
use App\Models\MedicalData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    // Récupérer tous les patients
    public function index()
    {
        $patients = Patient::with(['administrativeData', 'medicalData'])->get();
        return response()->json($patients);
    }

    // Créer un nouveau patient
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'age' => 'required|integer',
            'date_of_birth' => 'required|date',
            'phone' => 'required|string',
            'address' => 'required|string',
            'sex' => 'required|string',
            'registration_date' => 'required|date',
            'referring_doctor' => 'required|string',
            'medical_history' => 'nullable|string',
            'last_treatment' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Créer le patient
        $patient = Patient::create($request->only([
            'first_name',
            'last_name',
            'age',
            'date_of_birth',
            'phone',
            'address',
            'sex'
        ]));

        // Créer les données administratives
        $administrativeData = new AdministrativeData([
            'registration_date' => $request->registration_date,
            'referring_doctor' => $request->referring_doctor
        ]);
        $patient->administrativeData()->save($administrativeData);

        // Créer les données médicales
        $medicalData = new MedicalData([
            'medical_history' => $request->medical_history,
            'last_treatment' => $request->last_treatment
        ]);
        $patient->medicalData()->save($medicalData);

        return response()->json([
            'message' => 'Patient créé avec succès',
            'patient' => $patient->load(['administrativeData', 'medicalData'])
        ], 201);
    }

    // Récupérer un patient spécifique
    public function show($id)
    {
        $patient = Patient::with(['administrativeData', 'medicalData'])->find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        return response()->json($patient);
    }

    // Mettre à jour un patient
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'age' => 'sometimes|integer',
            'date_of_birth' => 'sometimes|date',
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
            'sex' => 'sometimes|string',
            'registration_date' => 'sometimes|date',
            'referring_doctor' => 'sometimes|string',
            'medical_history' => 'nullable|string',
            'last_treatment' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Mettre à jour le patient
        $patient->update($request->only([
            'first_name',
            'last_name',
            'age',
            'date_of_birth',
            'phone',
            'address',
            'sex'
        ]));

        // Mettre à jour les données administratives
        if ($request->has('registration_date') || $request->has('referring_doctor')) {
            $patient->administrativeData()->update([
                'registration_date' => $request->registration_date ?? $patient->administrativeData->registration_date,
                'referring_doctor' => $request->referring_doctor ?? $patient->administrativeData->referring_doctor
            ]);
        }

        // Mettre à jour les données médicales
        if ($request->has('medical_history') || $request->has('last_treatment')) {
            $patient->medicalData()->update([
                'medical_history' => $request->medical_history ?? $patient->medicalData->medical_history,
                'last_treatment' => $request->last_treatment ?? $patient->medicalData->last_treatment
            ]);
        }

        return response()->json([
            'message' => 'Patient mis à jour avec succès',
            'patient' => $patient->load(['administrativeData', 'medicalData'])
        ]);
    }

    // Supprimer un patient
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        $patient->delete();
        return response()->json(['message' => 'Patient supprimé avec succès']);
    }
}
