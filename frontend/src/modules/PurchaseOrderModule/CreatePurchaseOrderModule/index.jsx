import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import PurchaseOrderForm from '@/modules/PurchaseOrderModule/Forms/PurchaseOrderForm';

export default function CreatePurchaseOrderModule({ config }) {
    return (
        <ErpLayout>
            <CreateItem config={config} CreateForm={PurchaseOrderForm} />
        </ErpLayout>
    );
}
