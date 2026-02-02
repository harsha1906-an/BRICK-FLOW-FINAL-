import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';

export default function InvoiceItemRow({ field, remove, current = null }) {
    const [totalState, setTotal] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const money = useMoney();

    // Hardcode quantity to 1 for Real Estate, but allow update if really needed via logic
    // For now, we hide the input but keep the state
    const updatePrice = (value) => {
        setPrice(value);
    };

    useEffect(() => {
        if (current) {
            const { items, invoice } = current;
            const targetItems = invoice ? invoice : items;

            if (targetItems && targetItems[field.fieldKey]) {
                const item = targetItems[field.fieldKey];
                if (item) {
                    setQuantity(item.quantity || 1);
                    setPrice(item.price);
                }
            }
        }
    }, [current]);

    useEffect(() => {
        const currentTotal = calculate.multiply(price, quantity);
        setTotal(currentTotal);
    }, [price, quantity]);

    return (
        <Row gutter={[12, 12]} style={{ position: 'relative' }}>
            <Col className="gutter-row" span={10}>
                <Form.Item
                    name={[field.name, 'itemName']}
                    rules={[
                        {
                            required: true,
                            message: 'Missing property details',
                        },
                    ]}
                >
                    <Input placeholder="Property/Unit Details (e.g. Villa 101 Booking)" />
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
                <Form.Item name={[field.name, 'description']}>
                    <Input placeholder="Description (e.g. Down Payment)" />
                </Form.Item>
            </Col>
            {/* Hidden Quantity Field - Force to 1 */}
            <Form.Item name={[field.name, 'quantity']} initialValue={1} hidden={true}>
                <InputNumber />
            </Form.Item>

            <Col className="gutter-row" span={6}>
                <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
                    <InputNumber
                        className="moneyInput"
                        onChange={updatePrice}
                        min={0}
                        controls={false}
                        addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
                        addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
                        style={{ width: '100%' }}
                        placeholder="Amount"
                    />
                </Form.Item>
            </Col>
            {/* 
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              formatter={(value) =>
                money.amountFormatter({ amount: value, currency_code: money.currency_code })
              }
            />
        </Form.Item>
      </Col> 
      Total is redundant if Quantity is 1, but we keep the calculation logic for the backend.
      We can hide the column or show it if we assume Price = Total.
      */}

            <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
                <DeleteOutlined onClick={() => remove(field.name)} />
            </div>
        </Row>
    );
}
