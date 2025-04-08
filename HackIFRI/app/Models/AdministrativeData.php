<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdministrativeData extends Model
{

    use HasFactory;

    protected $fillable = [
        'patient_id',
        'registration_date',
        'referring_doctor'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

}
