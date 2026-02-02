import React from 'react';
import CreateProjectModule from '@/modules/ProjectModule/CreateProjectModule';

export default function ProjectCreate() {
    const entity = 'project';
    const PANEL_TITLE = 'Create Project';
    const ENTITY_NAME = 'project';
    const CREATE_ENTITY = 'Create Project';
    const UPDATE_ENTITY = 'Update Project';
    const DATATABLE_TITLE = 'Project List';

    const config = {
        entity,
        PANEL_TITLE,
        ENTITY_NAME,
        CREATE_ENTITY,
        UPDATE_ENTITY,
        DATATABLE_TITLE,
    };
    return <CreateProjectModule config={config} />;
}
