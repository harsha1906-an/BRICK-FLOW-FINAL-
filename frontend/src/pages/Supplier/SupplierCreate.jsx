import React from 'react';
import CreateSupplierModule from '@/modules/SupplierModule/CreateSupplierModule';

export default function SupplierCreate() {
    const entity = 'supplier';
    const PANEL_TITLE = 'Create Supplier';
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
    return <CreateSupplierModule config={config} />;
}
