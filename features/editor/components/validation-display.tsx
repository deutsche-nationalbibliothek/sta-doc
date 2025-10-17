import React from 'react';
import { Alert, List, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ValidationResult } from '../types/editor';

const { Text } = Typography;

interface ValidationDisplayProps {
  validationResult: ValidationResult;
}

export const ValidationDisplay: React.FC<ValidationDisplayProps> = ({ validationResult }) => {
  if (validationResult.isValid) {
    return (
      <Alert
        message="Validierung erfolgreich"
        description="Die Entity ist gültig und kann gespeichert werden."
        type="success"
        showIcon
        style={{ marginBottom: '16px' }}
      />
    );
  }

  const errors = validationResult.errors || [];
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const infoCount = errors.filter(e => e.severity === 'info').length;

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#ff4d4f';
      case 'warning':
        return '#faad14';
      case 'info':
        return '#1890ff';
      default:
        return '#666';
    }
  };

  return (
    <Alert
      message="Validierungsfehler gefunden"
      description={
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>
              {errorCount > 0 && `${errorCount} Fehler`}
              {errorCount > 0 && warningCount > 0 && ', '}
              {warningCount > 0 && `${warningCount} Warnungen`}
              {infoCount > 0 && (errorCount > 0 || warningCount > 0 ? ', ' : '')}
              {infoCount > 0 && `${infoCount} Hinweise`}
            </Text>
          </div>
          
          <List
            size="small"
            dataSource={errors}
            renderItem={(error) => (
              <List.Item style={{ padding: '4px 0' }}>
                <Space>
                  {getIcon(error.severity)}
                  <div>
                    <Text style={{ color: getSeverityColor(error.severity) }}>
                      {error.field && `${error.field}: `}
                      {error.message}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Space>
      }
      type="error"
      showIcon
      style={{ marginBottom: '16px' }}
    />
  );
};
