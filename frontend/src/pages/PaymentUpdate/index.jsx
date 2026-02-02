import useLanguage from '@/locale/useLanguage';
import PaymentUpdateDataTableModule from '@/modules/PaymentModule/PaymentUpdateDataTableModule';

import { useMoney, useDate } from '@/settings';

export default function PaymentUpdate() {
    const translate = useLanguage();
    const { dateFormat } = useDate();
    const { moneyFormatter } = useMoney();
    const searchConfig = {
        entity: 'paymentupdate',
        displayLabels: ['status'],
        searchFields: 'status',
        outputValue: '_id',
    };

    const deleteModalLabels = ['status'];
    const dataTableColumns = [
        {
            title: translate('Status'),
            dataIndex: 'status',
        },
        {
            title: translate('Requested By'),
            dataIndex: ['requestedBy', 'name'],
        },
        {
            title: translate('Payment'),
            dataIndex: ['payment', 'number'],
        },
        {
            title: translate('Changes'),
            dataIndex: 'requestedChanges',
            render: (changes) => {
                return JSON.stringify(changes);
            }
        },
    ];

    const entity = 'paymentupdate';

    const Labels = {
        PANEL_TITLE: translate('Payment Update Requests'),
        DATATABLE_TITLE: translate('Requests List'),
        ADD_NEW_ENTITY: translate('request'),
        ENTITY_NAME: translate('request'),
    };

    const configPage = {
        entity,
        ...Labels,
    };
    const config = {
        ...configPage,
        disableAdd: true,
        dataTableColumns,
        searchConfig,
        deleteModalLabels,
    };
    return <PaymentUpdateDataTableModule config={config} />;
}
