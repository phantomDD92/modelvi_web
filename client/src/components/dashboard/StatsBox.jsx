import { Card, Row, Col } from 'antd';

const StatsBox = ({ title, count }) => {
  const span = items.length > 0 ? 24 / items.length : 24;
  return (
    <div>
      <div>{title}</div>
      <Row>
        {items.map(item =>
          <Col key={`col_${item.heading}`} span={span}>
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <div>{item.heading}</div>
                <div>{item.count}</div>
              </div>
            </div>
          </Col>
        )}
      </Row>
      </div>
  )
};

export default StatsBox;