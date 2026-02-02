import React from 'react';
import UpdateProjectModule from '@/modules/ProjectModule/UpdateProjectModule';

export default function ProjectUpdate() {
    const entity = 'project';
    const PANEL_TITLE = 'Update Project';
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
    return <UpdateProjectModule config={config} />;
}
