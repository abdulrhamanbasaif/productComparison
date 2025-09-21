<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('features'),
                TextInput::make('user_id')
                    ->numeric(),
                TextInput::make('category'),
                TextInput::make('brand'),
                FileUpload::make('image')
                    ->image(),
                Toggle::make('inStock')
                    ->required(),
                TextInput::make('stockQuantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('specifications'),
            ]);
    }
}
