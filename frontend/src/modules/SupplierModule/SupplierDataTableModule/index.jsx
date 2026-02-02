import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

export default function SupplierDataTableModule({ config }) {
    return (
        <ErpLayout>
            <ErpPanel config={config} />
        </ErpLayout>
    );
}
