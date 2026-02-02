import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Divider, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import calculate from '@/utils/calculate';

export default function PurchaseOrderForm({ subTotal = 0, current = null }) {
    const translate = useLanguage();
    const { dateFormat } = useDate();

    const [total, setTotal] = useState(0);
    // Simple tax assumption: 0 for now unless requested
    const taxRate = 0;

    useEffect(() => {
        if (current) {
            // Load current values if editing
        }
    }, [current]);

    useEffect(() => {
        // Recalculate total
        // setTotal(subTotal);
        // Since we simplified, just use subTotal as total for now or add tax logic if needed
        setTotal(subTotal);
    }, [subTotal]);

    const addField = useRef(false);

    useEffect(() => {
        if (!current) addField.current.click();
    }, [current]);

    return (
        <>
            <Row gutter={[12, 0]}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="vendor"
                        label={translate('Vendor')}
                        rules={[{ required: true, message: 'Please enter vendor name' }]}
                    >
                        <Input placeholder="Vendor Name" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="number"
                        label={translate('PO Number')}
                        rules={[{ required: true, message: 'Please enter PO Number' }]}
                    >
                        <Input placeholder="PO-XXXX" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="date"
                        label={translate('Date')}
                        rules={[{ required: true, type: 'object' }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker style={{ width: '100%' }} format={dateFormat} />
                    </Form.Item>
                </Col>
            </Row>
            <Divider dashed />
            <Row gutter={[12, 12]} style={{ position: 'relative' }}>
                <Col className="gutter-row" span={5}>
                    <p>{translate('Item')}</p>
                </Col>
                <Col className="gutter-row" span={7}>
                    <p>{translate('Description')}</p>
                </Col>
                <Col className="gutter-row" span={3}>
                    <p>{translate('Quantity')}</p>
                </Col>
                <Col className="gutter-row" span={4}>
                    <p>{translate('Price')}</p>
                </Col>
                <Col className="gutter-row" span={5}>
                    <p>{translate('Total')}</p>
                </Col>
            </Row>
            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <ItemRow key={field.key} remove={remove} field={field} current={current}></ItemRow>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                                ref={addField}
                            >
                                {translate('Add Item')}
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Divider dashed />
            <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
                <Row gutter={[12, -5]}>
                    <Col className="gutter-row" span={5}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                                {translate('Save')}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4} offset={10}>
                        <p style={{ paddingLeft: '12px', paddingTop: '5px', margin: 0, textAlign: 'right' }}>
                            {translate('Total')} :
                        </p>
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <MoneyInputFormItem readOnly value={subTotal} />
                    </Col>
                </Row>
            </div>
        </>
    );
}
