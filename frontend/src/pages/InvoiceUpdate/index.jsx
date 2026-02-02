import useLanguage from '@/locale/useLanguage';
import InvoiceUpdateDataTableModule from '@/modules/InvoiceModule/InvoiceUpdateDataTableModule';

import { useMoney, useDate } from '@/settings';

export default function InvoiceUpdate() {
    const translate = useLanguage();
    const { dateFormat } = useDate();
    const { moneyFormatter } = useMoney();
    const searchConfig = {
        entity: 'invoiceupdate',
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
            title: translate('Invoice'),
            dataIndex: ['invoice', 'number'],
        },
        {
            title: translate('Changes'),
            dataIndex: 'requestedChanges',
            render: (changes) => {
                return JSON.stringify(changes);
            }
        },
    ];

    const entity = 'invoiceupdate';

    const Labels = {
        PANEL_TITLE: translate('Invoice Update Requests'),
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
    return <InvoiceUpdateDataTableModule config={config} />;
}
