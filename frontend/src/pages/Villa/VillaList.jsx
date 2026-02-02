import useLanguage from '@/locale/useLanguage';
import SelectAsync from '@/components/SelectAsync';
import { Tag } from 'antd';
import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

export default function VillaList() {
    const translate = useLanguage();

    const searchConfig = {
        entity: 'villa',
        displayLabels: ['villaNumber'],
        searchFields: 'villaNumber',
        outputValue: '_id',
    };

    const deleteModalLabels = ['villaNumber'];
    const dataTableColumns = [
        {
            title: translate('Villa Number'),
            dataIndex: 'villaNumber',
        },
        {
            title: translate('Type'),
            dataIndex: 'houseType',
        },
        {
            title: translate('Status'),
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'booked' ? 'green' : status === 'sold' ? 'red' : 'blue';
                return <Tag color={color}>{status ? status.toUpperCase() : 'AVAILABLE'}</Tag>;
            }
        },
        {
            title: translate('Built Up Area'),
            dataIndex: 'builtUpArea',
            render: (area) => area ? `${area} sqft` : '-',
        },
        {
            title: translate('Price'),
            dataIndex: 'price',
            render: (price) => price ? `$ ${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-',
        },
    ];

    const entity = 'villa';

    const Labels = {
        PANEL_TITLE: translate('Villas'),
        DATATABLE_TITLE: translate('Villa List'),
        ADD_NEW_ENTITY: translate('Add New Villa'),
        ENTITY_NAME: translate('Villa'),
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
        // We can define custom create/read routes if needed
        // readRoute: '/villa/read', 
    };

    return (
        <ErpLayout>
            <ErpPanel config={config}></ErpPanel>
        </ErpLayout>
    );
}
