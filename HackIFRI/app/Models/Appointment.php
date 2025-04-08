<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'date',
        'status',
        'notes'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function tasks()
    {
        return $this->belongsToMany(AppointmentTask::class, 'appointment_task_user')
                    ->withPivot('user_id')
                    ->withTimestamps();
    }

    public function consultation()
    {
        return $this->hasOne(Consultation::class);
    }
}
