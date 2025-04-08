<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MRCProtocolController;
use App\Http\Controllers\DialysisStepController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/login", [LoginController::class, 'login']);

// Routes pour l'administration
Route::put("/user", [AdminController::class, 'updateEmail'])->middleware("auth:sanctum")->middleware("role:admin");
Route::get("/stat", [AdminController::class, 'stat'])->middleware("auth:sanctum")->middleware("role:admin");
Route::put("/user/password", [AdminController::class, 'update'])->middleware("auth:sanctum")->middleware("role:admin");
Route::post('doctors', [AdminController::class, 'createUser'])->middleware('auth:sanctum')->middleware('role:admin');
Route::get('doctors', [AdminController::class, 'retrieveDoctor'])->middleware('auth:sanctum')->middleware('role:admin');

// Routes pour les protocoles MRC
Route::get('/protocols', [MRCProtocolController::class, 'index']);
Route::post('/protocols', [MRCProtocolController::class, 'store']);
Route::get('/protocols/{id}', [MRCProtocolController::class, 'show']);
Route::put('/protocols/{id}', [MRCProtocolController::class, 'update']);
Route::delete('/protocols/{id}', [MRCProtocolController::class, 'destroy']);

// Routes pour les étapes de dialyse
Route::get('/patients/{patientId}/dialysis-steps', [DialysisStepController::class, 'index']);
Route::post('/patients/{patientId}/dialysis-steps', [DialysisStepController::class, 'store']);
Route::get('/dialysis-steps/{id}', [DialysisStepController::class, 'show']);
Route::put('/dialysis-steps/{id}', [DialysisStepController::class, 'update']);
Route::delete('/dialysis-steps/{id}', [DialysisStepController::class, 'destroy']);

// Routes pour les patients
Route::prefix('patients')->group(function () {
    Route::get('/', [PatientController::class, 'index']);
    Route::post('/', [PatientController::class, 'store']);
    Route::get('/{id}', [PatientController::class, 'show']);
    Route::put('/{id}', [PatientController::class, 'update']);
    Route::delete('/{id}', [PatientController::class, 'destroy']);
});

// Routes pour les rendez-vous
Route::prefix('appointments')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::post('/', [AppointmentController::class, 'store']);
    Route::get('/{id}', [AppointmentController::class, 'show']);
    Route::put('/{id}', [AppointmentController::class, 'update']);
    Route::delete('/{id}', [AppointmentController::class, 'destroy']);
    Route::post('/{appointmentId}/tasks', [AppointmentController::class, 'addTask']);
});

// Routes pour les consultations
Route::prefix('consultations')->group(function () {
    Route::get('/', [ConsultationController::class, 'index']);
    Route::post('/', [ConsultationController::class, 'store']);
    Route::post('/from-appointment/{appointmentId}', [ConsultationController::class, 'fromAppointment']);
    Route::get('/{id}', [ConsultationController::class, 'show']);
    Route::put('/{id}', [ConsultationController::class, 'update']);
    Route::delete('/{id}', [ConsultationController::class, 'destroy']);
});

// Routes pour la réinitialisation de mot de passe
Route::get('/reset-password/{email}', [ResetPasswordController::class, 'showForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

//Envoyer le mot de passe temporaire 
Route::post('/send-temp-password', [ResetPasswordController::class, 'sendTemporaryPassword']);
