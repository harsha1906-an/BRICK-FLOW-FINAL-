import React from 'react';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import ProjectForm from '@/forms/ProjectForm';

export default function CreateProjectModule({ config }) {
    return (
        <CreateItem config={config} CreateForm={ProjectForm} />
    );
}
