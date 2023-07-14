import { Card, Radio, Button, Spin, Select} from "antd";
import { useState, useEffect } from "react";
import MapInputs from "./MapInputs";
import { SettingOutlined } from "@ant-design/icons";

const PageSettings = ({
  onClickHandler,
  isLoading,
  tabDetails,
  viewMapHandler,
  currentPageMapHandler,
}) => {
  const [config, setConfig] = useState({ extractPage: "Current" });
  const [inspect, setInspect] = useState(true);
  const changeConfig = (e) => {
    setConfig((prevState) => {
      return { extractPage: e.target.value };
    });
  };

  const inspectMode = async () => {
    setInspect(false);
    await chrome.tabs.sendMessage(tabDetails.id, { message: "mapData" });
  };

  const cancelInspectMode = async () => {
    setInspect(true);
    await chrome.tabs.sendMessage(tabDetails.id, {
      message: "cancelMapData",
    });
  };

  return (
    <Spin spinning={isLoading}>
<<<<<<< Updated upstream
      <Card title="Page Settings">
        <div>Pages: </div>
        <Radio.Group
          defaultValue="Current"
          onChange={changeConfig}
          style={{ marginTop: 10 }}
=======
        <Card title="Page Settings">
            <div>Pages: </div>
            <Radio.Group
                defaultValue="Current"
                onChange={changeConfig}
                style={{ marginTop: 10 }}
            >
            <Radio.Button value="Current">Current</Radio.Button>
            <Radio.Button value="All">All</Radio.Button>
            </Radio.Group>
        </Card>
        <Button
            style={{ marginTop: "10px" }}
            icon={<SettingOutlined />}
            onClick={() => {
                onClickHandler(config);
            }}
            block
        >
            Extract
        </Button>
        <Button
            style={{ marginTop: "10px" }}
            icon={<SettingOutlined />}
            onClick={inspectMode}
        >
            Inspect mode
        </Button>
        <Button
            style={{ marginLeft: "10px", marginTop: "10px" }}
            disabled={inspect ? true : false}
            onClick={cancelInspectMode}
>>>>>>> Stashed changes
        >
          <Radio.Button value="Current">Current</Radio.Button>
          <Radio.Button value="All">All</Radio.Button>
        </Radio.Group>
      </Card>
      <Button
        style={{ marginTop: "10px" }}
        icon={<SettingOutlined />}
        onClick={() => {
          onClickHandler(config);
        }}
        block
      >
        Extract
      </Button>
      <Button
        style={{ marginTop: "10px" }}
        icon={<SettingOutlined />}
        onClick={inspectMode}
        disabled={inspect ? false : true}
      >
        Inspect mode
      </Button>
      <Button
        style={{ marginLeft: "10px", marginTop: "10px" }}
        disabled={inspect ? true : false}
        onClick={cancelInspectMode}
      >
        Cancel
      </Button>
      <MapInputs
        tabDetails={tabDetails}
        viewMapHandler={viewMapHandler}
        currentPageMapHandler={currentPageMapHandler}
      />
    </Spin>
  );
};
export default PageSettings;
