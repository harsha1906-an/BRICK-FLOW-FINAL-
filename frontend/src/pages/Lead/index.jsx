import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LeadList = lazy(() => import('./LeadList'));
const LeadRead = lazy(() => import('./LeadRead'));

export default function LeadRouter() {
    return (
        <Routes>
            <Route path="/" element={<LeadList />} />
            <Route path="/read/:id" element={<LeadRead />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
