import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const LabourStatusBadge = ({ isActive }) => {
  if (isActive) {
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Active
      </Tag>
    );
  }
  return (
    <Tag icon={<CloseCircleOutlined />} color="default">
      Inactive
    </Tag>
  );
};

export default LabourStatusBadge;
