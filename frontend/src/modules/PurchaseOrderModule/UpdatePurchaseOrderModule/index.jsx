import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import PurchaseOrderForm from '@/modules/PurchaseOrderModule/Forms/PurchaseOrderForm';

export default function UpdatePurchaseOrderModule({ config }) {
    return (
        <ErpLayout>
            <UpdateItem config={config} UpdateForm={PurchaseOrderForm} />
        </ErpLayout>
    );
}
