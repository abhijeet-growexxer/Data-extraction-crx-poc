import classes from "./Header.module.css";
import { Tabs, message } from 'antd';
import { FilterOutlined, FileDoneOutlined } from "@ant-design/icons";
import ViewPage from "../RepeatableCards/ViewPage";
import PageSettings from "../PageSettings/PageSettings";
import { useState, useEffect } from "react"

const Header = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [tabDetails, setTabDetails] = useState({})

    const getTabDetails = async () => {
        chrome.runtime.sendMessage({ message: "tabDetails" }).then((response) => {
            const { tab } = response;
            setTabDetails(tab);
        });
    };


    const createURL = () => {
        const url = tabDetails.url.split("?")[1];
        const urlParams = new URLSearchParams(url);
        const entries = urlParams.entries();
        const path = `https://www.linkedin.com/voyager/api/graphql`;
        let keywordValue, geoUrnValues, networkValues;
        let variables = {};
        for (const entry of entries) {
            variables[entry[0]] = entry[1];
        }
        const { origin, geoUrn, network, keywords } = variables;
        const geoUrnJoined = geoUrn ? JSON.parse(geoUrn).join(','): "";
        const networkJoined = JSON.parse(network).join(',')
        keywordValue = encodeURI(keywords);
        geoUrnValues = geoUrn ? `,(key:geoUrn,value:List(${geoUrnJoined}))`: "";
        networkValues = network ? `,(key:network,value:List(${networkJoined}))`: "";
        const queryParameters = `List((key:resultType,value:List(PEOPLE))${geoUrnValues}${networkValues})`;
        const includeFiltersInResponse = false;
        const flagshipSearchIntent = `SEARCH_SRP`;
        const query = `(keywords:${keywordValue},flagshipSearchIntent:${flagshipSearchIntent},queryParameters:${queryParameters},includeFiltersInResponse:${includeFiltersInResponse})`;
        return{ path, origin, query };
    }

    const getAllPageData = async (totalPages) => {
        const { path ,origin, query } = createURL();
        const queryId = `voyagerSearchDashClusters.b0928897b71bd00a5a7291755dcd64f0`;
        const allCandidateDetails = [];
        try {
            for (let i = 0; i < totalPages; i++) {
                console.log(i);
                let page = i * 10;
                const variables = `(start:${page},origin:${origin},query:${query})`;
                const apiURL = `${path}?variables=${variables}&&queryId=${queryId}`;
                console.log(apiURL);
                const response = await fetch(apiURL, {
                    headers: {
                        accept: "application/vnd.linkedin.normalized+json+2.1",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                        "csrf-token": "ajax:8384151028185045228",
                        "sec-ch-ua":
                            '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Linux"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-li-lang": "en_US",
                        "x-li-page-instance":
                            "urn:li:page:d_flagship3_search_srp_people_load_more;/0szNANUScaA42uyD25bHA==",
                        "x-li-track":
                            '{"clientVersion":"1.12.6106","mpVersion":"1.12.6106","osName":"web","timezoneOffset":5.5,"timezone":"Asia/Calcutta","deviceFormFactor":"DESKTOP","mpName":"voyager-web","displayDensity":1,"displayWidth":1920,"displayHeight":1080}',
                        "x-restli-protocol-version": "2.0.0",
                        cookie:
                            'li_sugr=544c44a6-57de-4537-adaf-3849d1776913; bcookie="v=2&a7983a16-9254-4d77-8a61-cb6f31711e6a"; bscookie="v=1&202207140440374a9c446d-19cb-483f-87be-622e774b23e1AQFaKSumSobItUmXV9aePVc3RIxKkKM-"; li_rm=AQFyeFT6o4f6xQAAAYhJ3wUAWLrn7GwBs-QqgwmwS3kV2OztoBXAw3riv89X7IobtCebFGGIPkjY6Ujdo6EEIrxwKFSFa9rYegPFwYsL0bM43__V-5SH399B; aam_uuid=28467702588638688260964662418594215184; _gcl_au=1.1.2139540432.1684866535; g_state={"i_l":0}; liap=true; li_at=AQEDASXJ5wkEGmO0AAABiEnfQ0kAAAGIbevHSU4A0J2h1w6zRo4bAFU8_HA6eRhHN0LKPRJNaHLK-UXEJW-OTyqV3-ajaCs52UIPJb-PKEUBDTtmJ1LTcTFUQpfql6f3KnG6FrAg_O-8D47DrAulwLCv; JSESSIONID="ajax:8384151028185045228"; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; AnalyticsSyncHistory=AQKuK0DJztgpmQAAAYhJ32R-SmQAd7Ww5DMZYAkQgbzg3Z4R3y78KsscENyKokqbS1pGFzEx0w2JIJP_-AuZCQ; _guid=1e66e7b3-1349-4862-9617-6a2ca1a889ef; lms_ads=AQFNtwMJWwOG0wAAAYhJ32XPH1FzvjY-vh1C8BBt7_xHK4Qr9Lec8NQLY9mDpHa4g2KyOe2F3oB4y9N6LZVjuxa62qh51XRH; lms_analytics=AQFNtwMJWwOG0wAAAYhJ32XPH1FzvjY-vh1C8BBt7_xHK4Qr9Lec8NQLY9mDpHa4g2KyOe2F3oB4y9N6LZVjuxa62qh51XRH; s_fid=05C35FEF4BFA6899-2FA9080CDEA6EED8; gpv_pn=developer.linkedin.com%2F; mbox=session#581abb9d095c4bc2920c3d14901ebd3a#1685047365|PC#581abb9d095c4bc2920c3d14901ebd3a.31_0#1700597505; s_ips=1024; s_tp=2516; s_tslv=1685045510446; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19503%7CMCMID%7C28324621221799342890985167260669232859%7CMCAAMLH-1685718789%7C12%7CMCAAMB-1685718789%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1685121189s%7CNONE%7CvVersion%7C5.1.1%7CMCCIDH%7C-1744392363; UserMatchHistory=AQLplZNtsQcragAAAYhY-MIuTvwaYASOiRUiv3g83gIiqs0oFzSS_I00sj9GC4SdKlXm6MbhDK040WnSPTgIKNMREry5QcKcXi6T4fFXsPCgK_Zxjoj4xe9wtgWC8vD4_nM8I4cKtxde_jI5NEhLqrdUiQxWwH5ATpcHKvAmzEIZsz6p5fmViMpLZhH9OXHrY9RiZiqBE1_5lw8QT1lsQkCdXx3Gn4xbukocjxDZOIoexcYUKGc3LBwS5ru13ic_-YOc6ISY33xmiI8oRN-xgwuzkOMXrWn8jSYfDnFBsVhIDKEnFCJwio9MTisWgNPHFFeWATFWw3_X-PDRxo6fpND3OkCp6Ng; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiJjOGVjMjA3Yy1kY2RkLTQxYjQtOGM5NS0yZTg0ZmFiZWUyZmR8MTY4NTEyMDExOSIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vcHJlbWl1bS9wcm9kdWN0cy8_dXBzZWxsT3JkZXJPcmlnaW49cHJlbWl1bV9wZW9wbGVfc2VhcmNoX3VzYWdlX3Vwc2VsbCZ1dHlwZT1hYXNhYW4iLCJyZWNlbnRseS12aWV3ZWQiOiIiLCJDUFQtaWQiOiJcdTAwMEXCg8K-wqrDi8O-TGnCpsKCwoNJXHUwMDEwYGLDmCIsImV4cGVyaWVuY2UiOiIiLCJ0cmsiOiIifSwibmJmIjoxNjg1MTIwMTE5LCJpYXQiOjE2ODUxMjAxMTl9.g6Zm1bpm3_RNtkpsNxKP7xQp9sZVYZclpaw4lG_HOxQ; PLAY_LANG=en; lang=v=2&lang=en-US; lidc="b=VB73:s=V:r=V:a=V:p=V:g=3115:u=490:x=1:i=1685120120:t=1685183258:v=2:sig=AQE_aWoyRzC5LqHNi9znnGHRnL8DjTVE"',
                        Referer:
                            "https://www.linkedin.com/search/results/people/?keywords=Software%20Engineer&network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=6%3AL",
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                    },
                    body: null,
                    method: "GET",
                });
                const candidatesSearch = await response.json();
                const candidates = candidatesSearch?.included?.filter(({ template }) => template === "UNIVERSAL");
                for (const candidate of candidates) {
                    const profileURL = candidate?.navigationUrl;
                    const name = candidate?.title?.text;
                    const jobTitle = candidate?.primarySubtitle?.text || "---";
                    const summary = candidate?.summary?.text || "---";
                    const avatar = candidate?.image?.attributes[0]?.detailData?.nonEntityProfilePicture?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment
                        || null;
                    const currentLocation = candidate?.secondarySubtitle?.text || "---";
                    allCandidateDetails.push({ avatar, name, jobTitle, summary, currentLocation, profileURL });
                };
            }
            return { page: `1 - ${totalPages}`, data: allCandidateDetails }
        } catch (e) { 
            console.log(e)
        }
    }

    const extractFromPages = async (config) => {
        let content = ""
        let currentPage = 0;
        let totalPages = 0;
        await chrome.tabs.sendMessage(tabDetails.id, { message: 'getPageDetails' }).then((response) => {
            currentPage = response.currentPage
            totalPages = response.totalPages
        });
        setLoading((prevState) => true)
        if (config.extractPage === "Current") {
            chrome.tabs.sendMessage(tabDetails.id, { message: "Current" }).then((response) => {
                setData((prevState) => {
                    return { ...response.response };
                });
            });
            content = "Loaded from current page"
        } else {
            console.log(totalPages);
            const multiPageData = await getAllPageData(totalPages)
            setData((prevState) => { return { ...multiPageData }; });
            content = "Loaded from all pages";
        }

        setLoading((prevState) => false);

        messageApi.open({
            type: "success",
            content,
            duration: 1,
        });
    };

    const viewMappedData = (inputElements) => {
        const info = {};
        const infoArray = [];
        // if (flag === "map") {
        //     infoArray = [...data.data];
        // }
        
        inputElements.map((element) => { 
            return info[element.defaultSelectValue] = element.content 
        })
        infoArray.push({ ...info })
        setData((prevState) => {
            return { page: "--", data: infoArray };
        });
        console.log({com: "Header", data, info, infoArray})
    }

    const getMapInputs = (sample) => {
        chrome.tabs.sendMessage(tabDetails.id, { message: "currentPageMapping", sample }).then((response) => {
            setData((prevState) => {
                return { ...response };
            });
        });
    };

    useEffect(() => {
        getTabDetails();
    }, [])
    
    const items = [
      {
        label: (
          <span>
            <FilterOutlined /> Page Settings
          </span>
        ),
        key: "1",
        children: (
            <PageSettings
                onClickHandler={extractFromPages}
                tabDetails={tabDetails}
                isLoading={loading}
                viewMapHandler={viewMappedData}
                currentPageMapHandler={ getMapInputs }
            />
        ),
      },
      {
        label: (
          <span>
            <FileDoneOutlined /> View Data
          </span>
        ),
        key: "0",
        children: <ViewPage pages={data} />,
      },
    ];

    return (
        <div className={classes.header}>
            {contextHolder}
            <Tabs items={items} />
        </div>
    );
}
export default Header






