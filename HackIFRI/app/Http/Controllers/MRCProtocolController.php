<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MRCProtocol;

class MRCProtocolController extends Controller
{
    // Lister tous les protocoles
    public function index()
    {
        return response()->json(MRCProtocol::all());
    }
     // Créer un protocole
     public function store(Request $request)
     {
         $validated = $request->validate([
             'name' => 'required|string',
             'stage' => 'required|integer|min:1|max:5',
             'recommendations' => 'required|json'
         ]);
 
         $protocol = MRCProtocol::create($validated);
         return response()->json($protocol, 201);
     }
 
     // Assigner un protocole à un patient
     public function assignToPatient(Request $request, $patientId)
     {
         // Implémentation similaire avec une table pivot
     }
}
