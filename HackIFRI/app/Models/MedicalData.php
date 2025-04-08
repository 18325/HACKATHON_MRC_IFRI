<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalData extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'medical_history',
        'last_treatment'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
