import { EntityContentEditor } from '@/features/editor/entity-content-editor';
import { EditorRouteGuard } from '@/components/editor-route-guard';
import { useRouter } from 'next/router';
import { Spin } from 'antd';

export default function EditEntityPage() {
  const router = useRouter();
  const entityId =
    typeof router.query.entityId === 'string' ? router.query.entityId : undefined;

  if (!router.isReady || !entityId) {
    return <Spin />;
  }

  return (
    <EditorRouteGuard>
      <EntityContentEditor entityId={entityId} />
    </EditorRouteGuard>
  );
}
