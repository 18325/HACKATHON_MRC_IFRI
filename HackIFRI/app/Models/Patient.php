<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'date_of_birth',
        'phone',
        'address',
        'sex'
    ];

    public function administrativeData()
    {
        return $this->hasOne(AdministrativeData::class);
    }

    public function medicalData()
    {
        return $this->hasOne(MedicalData::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    // public function reports()
    // {
    //     return $this->hasMany(Report::class);
    // }
}
