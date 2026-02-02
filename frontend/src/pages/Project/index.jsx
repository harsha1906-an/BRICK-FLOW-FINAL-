import React from 'react';
import ProjectDataTableModule from '@/modules/ProjectModule/ProjectDataTableModule';
import { Tag } from 'antd';

export default function ProjectList() {
    const entity = 'project';
    const searchConfig = {
        entity: 'project',
        displayLabels: ['name', 'location'],
        searchFields: 'name,location',
        outputValue: '_id',
    };

    const PANEL_TITLE = 'Project List';
    const dataTableTitle = 'Project Lists';
    const entityDisplayLabels = ['name'];

    const readColumns = [
        {
            title: 'Project Name',
            dataIndex: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
        },
    ];

    const dataTableColumns = [
        {
            title: 'Project Name',
            dataIndex: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'In Progress') color = 'blue';
                if (status === 'Completed') color = 'green';
                if (status === 'On Hold') color = 'orange';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
        },
    ];

    const ADD_NEW_ENTITY = 'Add new Project';
    const DATATABLE_TITLE = 'Project List';
    const ENTITY_NAME = 'project';
    const CREATE_ENTITY = 'Create Project';
    const UPDATE_ENTITY = 'Update Project';

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
    };

    return <ProjectDataTableModule config={config} />;
}
