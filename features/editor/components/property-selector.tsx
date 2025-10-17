import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Space, Alert, Spin } from 'antd';
import { editorApiClient } from '@/lib/editor-api';
import { StaProperty, StatementRequest } from '../types/editor';

const { TextArea } = Input;

interface PropertySelectorProps {
  onSubmit: (request: StatementRequest) => void;
  onCancel: () => void;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [properties, setProperties] = useState<StaProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<StaProperty | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const props = await editorApiClient.getProperties();
      setProperties(props);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Properties');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (propertyKey: string) => {
    const property = properties.find(p => p.key === propertyKey);
    setSelectedProperty(property || null);
  };

  const handleSubmit = (values: StatementRequest) => {
    onSubmit(values);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
        <div style={{ marginTop: '8px' }}>Lade Properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Fehler"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={loadProperties}>
            Erneut versuchen
          </Button>
        }
      />
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        propertyKey: '',
        value: '',
      }}
    >
      <Form.Item
        label="Property auswählen"
        name="propertyKey"
        rules={[{ required: true, message: 'Bitte wählen Sie eine Property aus' }]}
      >
        <Select
          placeholder="Property auswählen..."
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={handlePropertyChange}
          options={properties.map(prop => ({
            value: prop.key,
            label: `${prop.label} (${prop.key})`,
          }))}
        />
      </Form.Item>

      {selectedProperty && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '8px 12px', 
          background: '#f0f8ff', 
          borderRadius: '4px',
          border: '1px solid #d6e4ff'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {selectedProperty.label}
          </div>
          {selectedProperty.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {selectedProperty.description}
            </div>
          )}
          {selectedProperty.dataType && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              Datentyp: {selectedProperty.dataType}
            </div>
          )}
        </div>
      )}

      <Form.Item
        label="Wert"
        name="value"
        rules={[{ required: true, message: 'Bitte geben Sie einen Wert ein' }]}
      >
        <TextArea
          rows={3}
          placeholder="Statement-Wert eingeben..."
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Statement hinzufügen
          </Button>
          <Button onClick={onCancel}>
            Abbrechen
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
