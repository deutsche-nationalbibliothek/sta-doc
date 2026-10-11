import React, { useState } from 'react';
import { Alert, Button, Form, Input, Space, Typography } from 'antd';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';

interface EditorLoginFormProps {
  redirectTo?: string;
}

export const EditorLoginForm: React.FC<EditorLoginFormProps> = ({
  redirectTo,
}) => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    setError(undefined);
    const message = await login(values.username, values.password);
    setSubmitting(false);
    if (message) {
      setError(message);
      return;
    }
    const target =
      redirectTo ||
      (typeof router.query.next === 'string' ? router.query.next : '/');
    await router.push(target);
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: 360 }}>
      <Typography.Title level={3}>Editor-Login</Typography.Title>
      <Typography.Paragraph type="secondary">
        Anmeldung über Confluence-Zugang (Rollen aus Gruppenmitgliedschaft).
      </Typography.Paragraph>
      {error && <Alert type="error" message={error} showIcon />}
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Benutzername"
          name="username"
          rules={[{ required: true, message: 'Benutzername erforderlich' }]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Passwort"
          name="password"
          rules={[{ required: true, message: 'Passwort erforderlich' }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>
          Anmelden
        </Button>
      </Form>
    </Space>
  );
};
