import { ErpLayout } from '@/layout';
import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReadPurchaseOrder from './ReadPurchaseOrder';
import NotFound from '@/components/NotFound';

export default function ReadPurchaseOrderModule({ config }) {
    const dispatch = useDispatch();
    const { id } = useParams();

    useLayoutEffect(() => {
        dispatch(erp.read({ entity: config.entity, id }));
    }, [id]);

    const { isSuccess, isLoading = true } = useSelector(selectReadItem);

    if (isLoading) {
        return (
            <ErpLayout>
                <PageLoader />
            </ErpLayout>
        );
    } else
        return (
            <ErpLayout>
                {isSuccess ? (
                    <ReadPurchaseOrder config={config} />
                ) : (
                    <NotFound entity={config.entity} />
                )}
            </ErpLayout>
        );
}
