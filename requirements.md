# BrickFlow ERP CRM - Project Requirements

## Overview
BrickFlow is a modern, real estate and construction-focused ERP and CRM system designed to streamline project management, leads, and financial tracking.

## Core Features
1.  **Dashboard**: Real-time summary of business health, including invoices, quotes, payments, and daily expenses.
2.  **Customer Management**: Comprehensive tracking of customer data and interactions.
3.  **Lead Management**: minimal CRM system for tracking and converting leads.
4.  **Inventory Tracking**: Management of site materials and inventory status.
5.  **Supplier Management**: Database of suppliers and procurement history.
6.  **Villa/Project Management**: Specific tracking for construction units and progress.
7.  **Financials**:
    *   Invoicing and Quotes.
    *   Payment recording and tracking.
    *   Daily expense summaries.
    *   Taxes and petty cash management.
8.  **Labour & Attendance**:
    *   Worker categorization (Daily Wage, Monthly Salary, Contract).
    *   Attendance tracking with mandatory selection and audit logs.
9.  **Approvals**: Workflow for reviewing and approving internal requests.

## Technical Requirements
### Frontend
*   **React**: Core library for building the UI.
*   **Ant Design (v5)**: UI component library with custom theme support.
*   **Theme Support**: Fully functional Light and Dark modes with dynamic switching.
*   **State Management**: Redux for global application state.
*   **Styling**: Vanilla CSS with theme-aware scoping.

### Backend
*   **Node.js & Express**: API and server-side logic.
*   **MongoDB**: Database for storing all persistent data.
*   **Authentication**: JWT-based secure user authentication and role-based access control.

### Optimization
*   **PWA (Progressive Web App)**: Installable web application with offline capabilities.
*   **Localization**: Support for multiple languages and currency formats.
*   **Responsive Design**: Mobile-first approach ensuring usability across all devices.

## Current State
The system is currently undergoing UI/UX refinements, focusing on theme consistency and enhanced mobile interactions.
