import { Table, Avatar, Button, Tooltip, message, Row, Modal, Checkbox, Divider} from "antd";
import {
  PicRightOutlined,
  UnorderedListOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import exportFromJSON from "export-from-json";
const CheckboxGroup = Checkbox.Group;

const TableView = ({ data, viewProfileHandler }) => {
  const [selectedData, setSelectedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();
    const dataSource = data.map((candidate, index) => { 
        return {
          index,
          ...candidate
        };
    })
    const info = (text) => { 
      message.info(text)
    };
    
    const rowSelection = {
      type: "checkbox",
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedData((prevState) => selectedRows)
      }
    };


    const columns = [
      {
        title: "Avatar",
        dataIndex: "avatar",
        render: (text) => <Avatar src={text}/>,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
      },
      {
        title: "Summary",
        dataIndex: "summary",
        render: (text) =>(
            <Tooltip title={text}>
              <Button icon={<UnorderedListOutlined />} />
            </Tooltip>
          )
      },
      {
        title: "Profile",
        dataIndex: "profileURL",
          render: (text) => (<Button onClick={ () => viewProfileHandler(text) } icon={<PicRightOutlined />} />)
        
      },
      {
        title: "Location",
        dataIndex: "currentLocation",
        key: "currentLocation",
      },
    ];
  
    const exportData = () => {
        if (selectedData.length === 0) {
            info("No data selected")
        } else {
            setCheckedList((prevState) => Object.keys(selectedData[0]))
            setIsModalOpen(true);
        }
    }

    const handleOk = () => {
        const exportData = selectedData.map((candidate) => {
            let obj = {};
            for (const key of checkedList) { 
                obj[key] = candidate[key]
            }
            return obj;
        })
        const fileName = 'CandidateList'
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data: exportData, fileName, exportType });
        setCheckAll(true)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (list) => {
        setCheckedList(list);
        setCheckAll(list.length === Object.keys(selectedData[0]).length);
    }
  
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? Object.keys(selectedData[0]) : []);
        setCheckAll(e.target.checked);
    };

  return (
    <div>
        {contextHolder}
        <Row justify="end">
            <Button
                icon={<DownloadOutlined />}
                style={{ marginBottom: "10px" }}
                onClick={exportData}
            >
            Export
            </Button>
        </Row>
        <Table
              rowSelection={rowSelection}
              dataSource={dataSource}
              columns={columns}
              rowKey={(record) => record.index}
              pagination={false}
        />
        <Modal
            title="Select the fields that you require for export"
            open={isModalOpen}
            onOk={handleOk} onCancel={handleCancel}
        >
            <Checkbox onChange={onCheckAllChange} checked={checkAll}> Check all </Checkbox>
            <Divider />
            <CheckboxGroup
                options={selectedData[0] ? Object.keys(selectedData[0]) : []}
                value={checkedList ? checkedList : [] }
                onChange={onChange}
            />
        </Modal>
    </div>
  );
};

export default TableView
