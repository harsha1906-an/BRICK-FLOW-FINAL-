import React from 'react';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import SupplierForm from '@/forms/SupplierForm';

export default function CreateSupplierModule({ config }) {
    return (
        <CreateItem config={config} CreateForm={SupplierForm} />
    );
}
