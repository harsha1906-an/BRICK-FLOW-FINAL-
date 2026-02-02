import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import { Button, notification } from 'antd';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

export default function PaymentUpdateDataTableModule({ config }) {
    const dispatch = useDispatch();

    const handleApprove = async (record) => {
        try {
            const response = await request.post({ entity: 'payment/approve', id: record._id });
            if (response.success) {
                notification.success({ message: 'Request Approved Successfully' });
                dispatch(erp.list({ entity: 'paymentUpdate' }));
            } else {
                notification.error({ message: response.message || 'Failed to approve' });
            }
        } catch (e) {
            notification.error({ message: 'Error approving request' });
        }
    };

    const dataTableColumns = [
        ...config.dataTableColumns,
        {
            title: 'Action',
            render: (_, record) => (
                <Button
                    type="primary"
                    disabled={record.status !== 'pending'}
                    onClick={() => handleApprove(record)}
                >
                    {record.status === 'pending' ? 'Approve' : record.status}
                </Button>
            ),
        },
    ];

    const newConfig = {
        ...config,
        dataTableColumns
    };

    return (
        <ErpLayout>
            <ErpPanel config={newConfig}></ErpPanel>
        </ErpLayout>
    );
}
