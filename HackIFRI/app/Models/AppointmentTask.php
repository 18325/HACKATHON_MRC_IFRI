<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'description',
        'status'
    ];

    public function appointments()
    {
        return $this->belongsToMany(Appointment::class, 'appointment_task_user')
                    ->withPivot('user_id')
                    ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'appointment_task_user')
                    ->withTimestamps();
    }
}
