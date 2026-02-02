import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import ReadItem from '@/modules/ErpPanelModule/ReadItem';
import ProjectForm from '@/forms/ProjectForm';
import { ErpLayout } from '@/layout';
import PageLoader from '@/components/PageLoader';
import NotFound from '@/components/NotFound';

export default function ReadProjectModule({ config }) {
    const dispatch = useDispatch();
    const { id } = useParams();

    useLayoutEffect(() => {
        dispatch(erp.read({ entity: config.entity, id }));
    }, [id]);

    const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

    if (isLoading) {
        return (
            <ErpLayout>
                <PageLoader />
            </ErpLayout>
        );
    }

    return (
        <ErpLayout>
            {isSuccess ? (
                <ReadItem config={config} selectedItem={currentResult} ReadForm={ProjectForm} />
            ) : (
                <NotFound entity={config.entity} />
            )}
        </ErpLayout>
    );
}
