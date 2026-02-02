import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const InventoryList = lazy(() => import('./InventoryList'));

export default function InventoryRouter() {
    return (
        <Routes>
            <Route path="/" element={<InventoryList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
