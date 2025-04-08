<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConsultationController extends Controller
{
    // Récupérer toutes les consultations
    public function index()
    {
        $consultations = Consultation::with(['patient', 'doctor', 'appointment'])->get();
        return response()->json($consultations);
    }

    // Créer une nouvelle consultation
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'consultation_date' => 'required|date',
            'doctor_remarks' => 'required|string',
            'cost' => 'required|numeric',
            'status' => 'sometimes|in:pending,completed,billed'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $consultation = Consultation::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'appointment_id' => $request->appointment_id,
            'consultation_date' => $request->consultation_date,
            'doctor_remarks' => $request->doctor_remarks,
            'cost' => $request->cost,
            'status' => $request->status ?? 'pending'
        ]);

        // Mettre à jour le statut du rendez-vous si lié
        if ($request->appointment_id) {
            Appointment::where('id', $request->appointment_id)
                ->update(['status' => 'completed']);
        }

        return response()->json([
            'message' => 'Consultation créée avec succès',
            'consultation' => $consultation->load(['patient', 'doctor', 'appointment'])
        ], 201);
    }

    // Récupérer une consultation spécifique
    public function show($id)
    {
        $consultation = Consultation::with(['patient', 'doctor', 'appointment'])->find($id);

        if (!$consultation) {
            return response()->json(['message' => 'Consultation non trouvée'], 404);
        }

        return response()->json($consultation);
    }

    // Mettre à jour une consultation
    public function update(Request $request, $id)
    {
        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json(['message' => 'Consultation non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'sometimes|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'consultation_date' => 'sometimes|date',
            'doctor_remarks' => 'sometimes|string',
            'cost' => 'sometimes|numeric',
            'status' => 'sometimes|in:pending,completed,billed'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $consultation->update($request->all());

        return response()->json([
            'message' => 'Consultation mise à jour avec succès',
            'consultation' => $consultation->load(['patient', 'doctor', 'appointment'])
        ]);
    }

    // Supprimer une consultation
    public function destroy($id)
    {
        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json(['message' => 'Consultation non trouvée'], 404);
        }

        $consultation->delete();
        return response()->json(['message' => 'Consultation supprimée avec succès']);
    }

    // Créer une consultation à partir d'un rendez-vous
    public function fromAppointment(Request $request, $appointmentId)
    {
        $appointment = Appointment::with('patient')->find($appointmentId);

        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'doctor_remarks' => 'required|string',
            'cost' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $consultation = Consultation::create([
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_id' => $appointment->id,
            'consultation_date' => now(),
            'doctor_remarks' => $request->doctor_remarks,
            'cost' => $request->cost,
            'status' => 'completed'
        ]);

        // Mettre à jour le statut du rendez-vous
        $appointment->update(['status' => 'completed']);

        return response()->json([
            'message' => 'Consultation créée à partir du rendez-vous avec succès',
            'consultation' => $consultation->load(['patient', 'doctor', 'appointment'])
        ], 201);
    }
}
