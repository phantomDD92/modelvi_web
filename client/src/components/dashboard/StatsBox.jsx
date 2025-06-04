import { Card, Row, Col , Statistic} from 'antd';

const StatsBox = ({ loading, items = [] }) => {
  return (
    <Card>
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