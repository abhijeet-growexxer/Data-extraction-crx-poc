import classes from "./RepeatableCards.module.css";
import { Empty, Button, Row, Col, Collapse, Avatar, Descriptions, Divider, Tooltip, message } from "antd";
const { Panel } = Collapse;
import { PicRightOutlined } from "@ant-design/icons";

const RepeatableCards = ({ data, viewProfileHandler }) => {
    if (!data || data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

  return (
    <div className={classes.container}>
        {/* { contextHolder} */}
        <Collapse
            accordian
            style={{ marginTop: "10px" }}
            expandIconPosition="end"
        >
            {data.map((details) => {
                return (
                    <Panel
                    header={
                        <Row>
                        <Col>
                            <Avatar src={details?.avatar || ""} />
                        </Col>
                        <Divider type="vertical" />
                        <Col>
                            <div>
                            {details?.name || "---"}
                            <div style={{ fontSize: "10px" }}>
                                {details.jobTitle
                                ? details.jobTitle.length > 30
                                    ? details.jobTitle.slice(0, 30) + "..."
                                    : details.jobTitle
                                : "---"}
                            </div>
                            </div>
                        </Col>
                        </Row>
                    }
                    extra={
                        <Tooltip title="View Profile">
                        <Button
                            onClick={ () => viewProfileHandler(details.profileURL) }
                            icon={<PicRightOutlined />}
                        />
                        </Tooltip>
                    }
                    >
                    <Row>
                        <Descriptions title="Info">
                            <Descriptions.Item label="JobTitle">
                                {details.jobTitle}
                            </Descriptions.Item>
                            <Descriptions.Item label="Location">
                                {details?.currentLocation}
                            </Descriptions.Item>
                            <Descriptions.Item label="Summary">
                                {details.summary ? details.summary : "---"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Row>
                    </Panel>
                );
            })}
      </Collapse>
    </div>
  );
}
export default RepeatableCards;
