<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dialysis_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained();
            $table->string('type'); // ex:Hémodialyse, Dialyse péritonéale, etc 
            $table->dateTime('start_time');
            $table->integer('duration_minutes');
            $table->json('parameters');  //ex: {weight_before: 70kg, weight_after: 68kg, UF_volume: 2L}
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dialysis_steps');
    }
};
