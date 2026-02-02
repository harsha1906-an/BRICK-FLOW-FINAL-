import React from 'react';
import SupplierDataTableModule from '@/modules/SupplierModule/SupplierDataTableModule';
import { Table, Tag } from 'antd';

export default function SupplierList() {
    const entity = 'supplier';
    const searchConfig = {
        entity: 'supplier',
        displayLabels: ['name', 'email'],
        searchFields: 'name,email',
        outputValue: '_id',
    };

    const PANEL_TITLE = 'Supplier List';
    const dataTableTitle = 'Supplier Lists';
    const entityDisplayLabels = ['name'];

    const readColumns = [
        {
            title: 'Supplier Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'City',
            dataIndex: 'city',
        },
    ];

    const dataTableColumns = [
        {
            title: 'Supplier Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Tax Number',
            dataIndex: 'taxNumber',
        },
        {
            title: 'Status',
            dataIndex: 'enabled',
            render: (enabled) => (
                <Tag color={enabled ? 'green' : 'red'}>{enabled ? 'Active' : 'Disabled'}</Tag>
            ),
        },
    ];

    const ADD_NEW_ENTITY = 'Add new Supplier';
    const DATATABLE_TITLE = 'Supplier List';
    const ENTITY_NAME = 'supplier';
    const CREATE_ENTITY = 'Create Supplier';
    const UPDATE_ENTITY = 'Update Supplier';

    const config = {
        entity,
        PANEL_TITLE,
        dataTableTitle,
        ENTITY_NAME,
        CREATE_ENTITY,
        ADD_NEW_ENTITY,
        UPDATE_ENTITY,
        DATATABLE_TITLE,
        readColumns,
        dataTableColumns,
        searchConfig,
        entityDisplayLabels,
        deleteModalLabels: ['name'],
    };

    return <SupplierDataTableModule config={config} />;
}
