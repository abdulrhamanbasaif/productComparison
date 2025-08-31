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
    Schema::table('products', function (Blueprint $table) {
        $table->string('category')->nullable();
        $table->string('brand')->nullable();
        $table->string('image')->nullable();
        $table->boolean('inStock')->default(true);
        $table->integer('stockQuantity')->default(0);
        $table->json('specifications')->nullable();
    });
}

public function down(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn([
            'category',
            'brand',
            'image',
            'inStock',
            'stockQuantity',
            'specifications',
        ]);
    });
}
};
