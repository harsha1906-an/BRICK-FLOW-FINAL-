import React from 'react';
import ReadSupplierModule from '@/modules/SupplierModule/ReadSupplierModule';

export default function SupplierRead() {
    const entity = 'supplier';
    const PANEL_TITLE = 'Supplier Details';
    const ENTITY_NAME = 'supplier';
    const CREATE_ENTITY = 'Create Supplier';
    const UPDATE_ENTITY = 'Update Supplier';
    const DATATABLE_TITLE = 'Supplier List';

    const config = {
        entity,
        PANEL_TITLE,
        ENTITY_NAME,
        CREATE_ENTITY,
        UPDATE_ENTITY,
        DATATABLE_TITLE,
    };
    return <ReadSupplierModule config={config} />;
}
