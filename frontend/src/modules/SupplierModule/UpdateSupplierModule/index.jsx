import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import SupplierForm from '@/forms/SupplierForm';
import { ErpLayout } from '@/layout';
import PageLoader from '@/components/PageLoader';
import NotFound from '@/components/NotFound';

export default function UpdateSupplierModule({ config }) {
    const dispatch = useDispatch();
    const { id } = useParams();

    useLayoutEffect(() => {
        if (id) {
            dispatch(erp.read({ entity: config.entity, id }));
        }
    }, [id]);

    const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

    useLayoutEffect(() => {
        if (currentResult) {
            dispatch(erp.currentAction({ actionType: 'update', data: currentResult }));
        }
    }, [currentResult]);


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
                <UpdateItem config={config} UpdateForm={SupplierForm} />
            ) : (
                <NotFound entity={config.entity} />
            )}
        </ErpLayout>
    );
}
