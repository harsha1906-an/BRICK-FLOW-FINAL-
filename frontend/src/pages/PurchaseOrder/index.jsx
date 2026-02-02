import dayjs from 'dayjs';
import { Tag } from 'antd';
// import { tagColor } from '@/utils/statusTagColor'; // Optional
import PurchaseOrderDataTableModule from '@/modules/PurchaseOrderModule/PurchaseOrderDataTableModule';
import { useMoney, useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

export default function PurchaseOrder() {
    const translate = useLanguage();
    const { dateFormat } = useDate();
    const entity = 'purchaseorder';
    const { moneyFormatter } = useMoney();

    const searchConfig = {
        entity: 'purchaseorder',
        displayLabels: ['number', 'vendor'],
        searchFields: 'number',
    };
    const deleteModalLabels = ['number'];

    const dataTableColumns = [
        {
            title: translate('Number'),
            dataIndex: 'number',
        },
        {
            title: translate('Requested By'),
            dataIndex: ['createdBy', 'name'],
            render: (name, record) => record.createdBy ? `${record.createdBy.name} ${record.createdBy.surname || ''}` : '',
        },
        {
            title: translate('Vendor'),
            dataIndex: 'vendor',
        },
        {
            title: translate('Date'),
            dataIndex: 'date',
            render: (date) => {
                return dayjs(date).format(dateFormat);
            },
        },
        {
            title: translate('Status'),
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : status === 'submitted' ? 'blue' : 'default';
                return <Tag color={color}>{translate(status && status.toUpperCase())}</Tag>;
            },
        },
        {
            title: translate('Total'),
            dataIndex: 'total',
            render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
        }
    ];

    const Labels = {
        PANEL_TITLE: translate('purchase_order'),
        DATATABLE_TITLE: translate('purchase_order_list'),
        ADD_NEW_ENTITY: translate('add_new_purchase_order'),
        ENTITY_NAME: translate('purchase_order'),
    };

    const configPage = {
        entity,
        ...Labels,
    };
    const config = {
        ...configPage,
        dataTableColumns,
        searchConfig,
        deleteModalLabels,
    };
    return <PurchaseOrderDataTableModule config={config} />;
}
