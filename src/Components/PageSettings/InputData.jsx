import { Select, Input, Row, Col , Button} from "antd";
import { CloseOutlined, AimOutlined } from "@ant-design/icons";

const InputData = ({
    index,
    removeHandler,
    id,
    defaultSelectValue,
    content,
    mapHandler,
    selectChangeHandler,
    contentChangeHandler,
}) => {
    const selectBefore = (
        <Select value={defaultSelectValue} onChange={(e) => selectChangeHandler(e, id)}>
            <Option value="name">Name</Option>
            <Option value="avatar">Avatar</Option>
            <Option value="jobTitle">JobTitle</Option>
            <Option value="currentLocation">Location</Option>
            <Option value="summary">Summary</Option>
            <Option value="profileURL">ProfileURL</Option>
        </Select>
    );

  return (
    <Row style={{ marginTop: "10px" }}>
        <Col span={2}>
            <Button icon={<CloseOutlined />} onClick={() => removeHandler(id)} />
        </Col>
        <Col span={20} offset={1}>
            <Input
                addonBefore={selectBefore}
                value={content}
                onChange={ (e)=>contentChangeHandler(e, id)} 
                addonAfter={<AimOutlined onClick={() => { mapHandler(id, "map") }} />}      
            />
        </Col>
    </Row>
  );
};
export default InputData;