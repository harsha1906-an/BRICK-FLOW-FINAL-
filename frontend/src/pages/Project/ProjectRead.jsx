import React from 'react';
import ReadProjectModule from '@/modules/ProjectModule/ReadProjectModule';

export default function ProjectRead() {
    const entity = 'project';
    const PANEL_TITLE = 'Project Details';
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
    return <ReadProjectModule config={config} />;
}
