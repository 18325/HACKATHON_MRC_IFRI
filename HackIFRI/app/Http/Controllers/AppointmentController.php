<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    // Récupérer tous les rendez-vous
    public function index()
    {
        $appointments = Appointment::with(['patient', 'doctor', 'tasks'])->get();
        return response()->json($appointments);
    }

    // Créer un nouveau rendez-vous
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'tasks' => 'nullable|array',
            'tasks.*' => 'exists:appointment_tasks,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $appointment = Appointment::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
            'notes' => $request->notes,
            'status' => 'scheduled'
        ]);

        if ($request->has('tasks')) {
            $appointment->tasks()->attach($request->tasks, ['user_id' => $request->doctor_id]);
        }

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'appointment' => $appointment->load(['patient', 'doctor', 'tasks'])
        ], 201);
    }

    // Récupérer un rendez-vous spécifique
    public function show($id)
    {
        $appointment = Appointment::with(['patient', 'doctor', 'tasks'])->find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous non trouvé'], 404);
        }

        return response()->json($appointment);
    }

    // Mettre à jour un rendez-vous
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:scheduled,completed,canceled',
            'notes' => 'nullable|string',
            'tasks' => 'nullable|array',
            'tasks.*' => 'exists:appointment_tasks,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $appointment->update($request->only(['patient_id', 'doctor_id', 'date', 'status', 'notes']));

        if ($request->has('tasks')) {
            $appointment->tasks()->sync($request->tasks);
        }

        return response()->json([
            'message' => 'Rendez-vous mis à jour avec succès',
            'appointment' => $appointment->load(['patient', 'doctor', 'tasks'])
        ]);
    }

    // Supprimer un rendez-vous
    public function destroy($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous non trouvé'], 404);
        }

        $appointment->delete();
        return response()->json(['message' => 'Rendez-vous supprimé avec succès']);
    }

    // Ajouter une tâche à un rendez-vous
    public function addTask(Request $request, $appointmentId)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:appointment_tasks,id',
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $appointment = Appointment::find($appointmentId);
        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous non trouvé'], 404);
        }

        $appointment->tasks()->attach($request->task_id, ['user_id' => $request->user_id]);

        return response()->json([
            'message' => 'Tâche ajoutée au rendez-vous avec succès',
            'appointment' => $appointment->load(['tasks'])
        ]);
    }
}
