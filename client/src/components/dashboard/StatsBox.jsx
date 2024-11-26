import { Card, Row, Col } from 'antd';

const StatsBox = ({ title, description, items = [] }) => {
  const span = items.length > 0 ? 24 / items.length : 24;
  return (
    <Card title={title} >
      <Row>
        {items.map(item =>
          <Col key={`col_${item.heading}`} span={span}>
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <span>{item.heading}</span>
                <span>{item.count}</span>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  )
};

export default StatsBox;