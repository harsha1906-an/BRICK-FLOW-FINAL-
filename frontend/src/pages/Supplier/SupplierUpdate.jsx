import React from 'react';
import UpdateSupplierModule from '@/modules/SupplierModule/UpdateSupplierModule';

export default function SupplierUpdate() {
    const entity = 'supplier';
    const PANEL_TITLE = 'Update Supplier';
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
    return <UpdateSupplierModule config={config} />;
}
