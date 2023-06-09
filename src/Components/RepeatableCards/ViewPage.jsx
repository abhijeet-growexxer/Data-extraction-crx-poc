import RepeatableCards from "./RepeatableCards";
import { useState } from "react"; 
import { Row, Statistic, Segmented, message} from "antd";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import TableView from "./TableView";

const ViewPage = ({ pages }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [value, setValue] = useState("List")
    const changeView = (value) => { 
        setValue(value);
    }
    const viewProfile = (url) => {
        navigator.clipboard.writeText(url);
        messageApi.info("Copied profile URL");
    };

    return (
        <div>
            { contextHolder }
            <Row>
                <Statistic
                    title="Page(s)"
                    size="small"
                    value={pages.page}
                    style={{ marginTop: "10px", fontSize: "15px" }}
                />
            </Row>
            <Row>
                <Segmented
                    options={[
                    {
                        value: "List",
                        icon: <BarsOutlined />,
                    },
                    {
                        value: "Table",
                        icon: <AppstoreOutlined />,
                    },
                    ]}
                    value={value}
                    onChange={changeView}
                />
            </Row>
            <Row>
                {value === "List" ? (
                        <RepeatableCards data={pages.data} viewProfileHandler={ viewProfile} />
                ) : (
                <TableView data={pages.data} viewProfileHandler={ viewProfile}/>
                )}
            </Row>
        </div>
    );
};
export default ViewPage;
