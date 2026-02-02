import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

export default function ProjectDataTableModule({ config }) {
    return (
        <ErpLayout>
            <ErpPanel config={config} />
        </ErpLayout>
    );
}
