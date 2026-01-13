import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const StatsBox = ({ loading, items = [], ...props }) => {
  return (
    <Card {...props}>
      <Row gutter={16}>
        {items.map(item =>
          <Col span={8}>
            <Statistic title={item.label} loading={loading} value={item.value} prefix={item.icon} />
          </Col>
        )}
      </Row>
    </Card>
  )
};

export default StatsBox;