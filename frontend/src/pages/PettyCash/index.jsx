import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const PettyCashList = lazy(() => import('./PettyCashList'));

export default function PettyCashRouter() {
    return (
        <Routes>
            <Route path="/" element={<PettyCashList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
