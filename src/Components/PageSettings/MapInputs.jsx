import { Card, Button, message } from "antd";
import { useState } from "react";
import InputData from "./InputData";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  AimOutlined,
} from "@ant-design/icons";

const MapInputs = ({ tabDetails, viewMapHandler, currentPageMapHandler }) => {
    const [inputElements, setInputElements] = useState([]);
    const [sample, setSample] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const onCurrentSelectChange = (e, id) => { 
        let updatedElements = [...inputElements];
        for (const element of updatedElements) { 
            if (element.id === id) { 
                element.defaultSelectValue = e;
            }
        }
        setInputElements(prevState => updatedElements)
    }

    const onCurrentValueChange = (e, id) => {
        let updatedElements = [...inputElements];
        for (const element of updatedElements) {
            if (element.id === id) {
                element.content = e.target.value;
            }
        }
        setInputElements((prevState) => updatedElements);
    };

    const addInput = () => {
        let count = inputElements.length > 0 ? inputElements.length : 0  
        setInputElements((prevState) => { 
            return [...prevState, {id: count, defaultSelectValue:"name", content:"" }]
        })
    }
    

    const getMappedData = async (id) => {
        await chrome.tabs.sendMessage(tabDetails.id, { message: "getMappedContent" }).then((response) => {
          console.log('response000', response);
            let updatedElements = [...inputElements];
            let dupSample = [...sample];
            for (const element of updatedElements) {
                if (element.id === id) {
                    dupSample.push({
                        listId: response.listId,
                        datapointId: response.dataPoint,
                        fieldName: element.defaultSelectValue,
                    });
                    console.log('upSample000', dupSample);
                    localStorage.setItem('configOfData', JSON.stringify(dupSample));
                    //console.log(localStorage.getItem("configOfData"));
                    setSample(dupSample);
                    element.content = response.content;
                }
            }
            setInputElements((prevState) => updatedElements);
        });
    };
    
    const sendElements = () => { 
        viewMapHandler(inputElements, sample);
        resetInputs();
        messageApi.success("Card Created!");
        console.log("card created")
    }

    const removeInput = (id) => {
        let elements = [...inputElements];
        let updatedElement = elements.filter((element) => { 
            return element.id !== id
        })
        setInputElements(updatedElement)
    }

    const resetInputs = () => {
        const updatedElements = []
        setInputElements(updatedElements)
    }

    return (
      <Card
        style={{ marginTop: "10px" }}
        actions={[
          <AppstoreAddOutlined
            key="addToView"
            onClick={() => sendElements()}
          />,
        ]}
      >
        {contextHolder}
        <Button
          icon={<AimOutlined />}
          style={{ marginTop: "10px" }}
          onClick={()=>currentPageMapHandler(sample)}
        >
          Aim All
        </Button>
        <Button
          icon={<PlusOutlined />}
          style={{ marginTop: "10px" }}
          onClick={addInput}
        />
        {inputElements.length > 0
          ? inputElements.map(({ id, defaultSelectValue, content }, index) => {
              return (
                <InputData
                  index={index}
                  id={id}
                  defaultSelectValue={defaultSelectValue}
                  content={content}
                  mapHandler={getMappedData}
                  selectChangeHandler={onCurrentSelectChange}
                  contentChangeHandler={onCurrentValueChange}
                  removeHandler={removeInput}
                />
              );
            })
          : null}
      </Card>
    );
}

export default MapInputs