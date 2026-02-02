import React, { useEffect, useState } from 'react';
import { Card, Tabs, Table, Select, DatePicker, Space, Tag, Empty, App, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/appContext';
import { request } from '@/request';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const AttendanceReview = () => {
    const [activeTab, setActiveTab] = useState('by-date');
    const { state: stateApp } = useAppContext();
    const companyId = stateApp.currentCompany;

    return (
        <div>
            <Card>
                <h2>Attendance Review</h2>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="By Date" key="by-date">
                        <ByDateView companyId={companyId} />
                    </TabPane>
                    <TabPane tab="By Labour" key="by-labour">
                        <ByLabourView companyId={companyId} />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

// By Date View Component
const ByDateView = ({ companyId }) => {
    const { message } = App.useApp();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [labourList, setLabourList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, present, absent

    useEffect(() => {
        if (companyId) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [selectedDate, companyId]);

    useEffect(() => {
        if (companyId) {
            fetchLabourList();
        }
        // eslint-disable-next-line
    }, [companyId]);

    const fetchLabourList = async () => {
        try {
            const res = await request.get({ entity: `companies/${companyId}/labour` });
            setLabourList(res);
        } catch (e) {
            message.error('Failed to load labour list');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const res = await request.get({ entity: `companies/${companyId}/attendance?date=${dateStr}` });
            setData(res);
        } catch (e) {
            message.error('Failed to load attendance');
        }
        setLoading(false);
    };

    const getLabourName = (labourId) => {
        const labour = labourList.find(l => l._id === labourId);
        return labour ? labour.name : labourId;
    };

    const getLabourSkill = (labourId) => {
        const labour = labourList.find(l => l._id === labourId);
        if (!labour) return '-';
        const skillMap = {
            mason: 'Mason',
            electrician: 'Electrician',
            plumber: 'Plumber',
            helper: 'Helper',
            other: 'Other'
        };
        return skillMap[labour.skill] || labour.skill;
    };

    const filteredData = data.filter(record => {
        if (filter === 'present') return record.status === 'present';
        if (filter === 'absent') return record.status === 'absent';
        return true;
    });

    const columns = [
        {
            title: 'Labour Name',
            dataIndex: 'labourId',
            key: 'labourId',
            render: (labourId) => getLabourName(labourId),
            sorter: (a, b) => getLabourName(a.labourId).localeCompare(getLabourName(b.labourId))
        },
        {
            title: 'Skill',
            dataIndex: 'labourId',
            key: 'skill',
            render: (labourId) => getLabourSkill(labourId)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status === 'present' ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Present</Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">Absent</Tag>
                ),
            filters: [
                { text: 'Present', value: 'present' },
                { text: 'Absent', value: 'absent' },
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Marked At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD MMM YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
        }
    ];

    const presentCount = data.filter(r => r.status === 'present').length;
    const absentCount = data.filter(r => r.status === 'absent').length;

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space>
                <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    format="YYYY-MM-DD"
                    style={{ width: 200 }}
                />
                <Select
                    value={filter}
                    onChange={setFilter}
                    style={{ width: 150 }}
                    options={[
                        { label: 'All Status', value: 'all' },
                        { label: 'Present Only', value: 'present' },
                        { label: 'Absent Only', value: 'absent' }
                    ]}
                />
            </Space>

            {data.length > 0 && (
                <div>
                    <Space size="large">
                        <span>Total: <strong>{data.length}</strong></span>
                        <span>Present: <strong style={{ color: '#52c41a' }}>{presentCount}</strong></span>
                        <span>Absent: <strong style={{ color: '#ff4d4f' }}>{absentCount}</strong></span>
                    </Space>
                </div>
            )}

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                locale={{
                    emptyText: <Empty description={`No attendance records for ${selectedDate.format('DD MMM YYYY')}`} />
                }}
                pagination={{ pageSize: 20 }}
            />
        </Space>
    );
};

// By Labour View Component
const ByLabourView = ({ companyId }) => {
    const { message } = App.useApp();
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [data, setData] = useState([]);
    const [labourList, setLabourList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (companyId) {
            fetchLabourList();
        }
        // eslint-disable-next-line
    }, [companyId]);

    useEffect(() => {
        if (selectedLabour && dateRange) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [selectedLabour, dateRange]);

    const fetchLabourList = async () => {
        try {
            const res = await request.get({ entity: `companies/${companyId}/labour` });
            setLabourList(res);
            if (res.length > 0) {
                setSelectedLabour(res[0]._id);
            }
        } catch (e) {
            message.error('Failed to load labour list');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await request.get({ entity: `companies/${companyId}/attendance?labourId=${selectedLabour}` });

            // Filter by date range
            const filtered = res.filter(record => {
                const recordDate = dayjs(record.date);
                return recordDate.isAfter(dateRange[0].subtract(1, 'day')) &&
                    recordDate.isBefore(dateRange[1].add(1, 'day'));
            });

            setData(filtered);
        } catch (e) {
            message.error('Failed to load attendance');
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Day',
            dataIndex: 'date',
            key: 'day',
            render: (date) => dayjs(date).format('dddd')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status === 'present' ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Present</Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">Absent</Tag>
                )
        },
        {
            title: 'Marked At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD MMM YYYY HH:mm')
        }
    ];

    const presentCount = data.filter(r => r.status === 'present').length;
    const totalDays = data.length;
    const attendancePercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0;

    const selectedLabourData = labourList.find(l => l._id === selectedLabour);

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space wrap>
                <Select
                    value={selectedLabour}
                    onChange={setSelectedLabour}
                    style={{ width: 250 }}
                    placeholder="Select Labour"
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={labourList.map(l => ({
                        label: `${l.name} (${l.skill})`,
                        value: l._id
                    }))}
                />
                <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    format="YYYY-MM-DD"
                />
            </Space>

            {selectedLabourData && (
                <Card size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div><strong>Name:</strong> {selectedLabourData.name}</div>
                        <div><strong>Skill:</strong> {selectedLabourData.skill}</div>
                        <div><strong>Status:</strong> {selectedLabourData.isActive ?
                            <Tag color="success">Active</Tag> :
                            <Tag color="default">Inactive</Tag>
                        }</div>
                    </Space>
                </Card>
            )}

            {data.length > 0 && (
                <Card size="small">
                    <Space size="large">
                        <span>Total Days: <strong>{totalDays}</strong></span>
                        <span>Present: <strong style={{ color: '#52c41a' }}>{presentCount}</strong></span>
                        <span>Absent: <strong style={{ color: '#ff4d4f' }}>{totalDays - presentCount}</strong></span>
                        <span>Attendance: <strong style={{ color: attendancePercentage >= 80 ? '#52c41a' : '#faad14' }}>{attendancePercentage}%</strong></span>
                    </Space>
                </Card>
            )}

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                loading={loading}
                locale={{
                    emptyText: <Empty description="No attendance records for selected period" />
                }}
                pagination={{ pageSize: 31, showSizeChanger: true, pageSizeOptions: ['31', '60', '90'] }}
            />
        </Space>
    );
};

export default AttendanceReview;
