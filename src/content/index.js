import { async } from "regenerator-runtime";

const listKeywords = ["result-list", "results-list", "jobs-list", "list"];
const listTags = ["ul", "ol", "div"]

const collectData = (list) => {
    const data = [];
    const searchResultContainer = Array.from(list.children);
    searchResultContainer.forEach((element) => {
        const avatar = element.querySelector(".presence-entity__image") ? element.querySelector(".presence-entity__image").src : null;
        const nameLink = element.querySelector(".entity-result__title-text").children[0];
        const profileURL = element.querySelector(".entity-result__title-text").children[0].href;
        const name = nameLink.querySelector(`span[aria-hidden="true"]`).textContent;
        const summary = element.querySelector(".entity-result__summary") ? element.querySelector(".entity-result__summary").textContent.trim():null;
        const jobTitle = element.querySelector(".entity-result__primary-subtitle") ? element.querySelector(".entity-result__primary-subtitle").textContent.trim() : null;
        const currentLocation = element.querySelector(".entity-result__secondary-subtitle") ? element.querySelector(".entity-result__secondary-subtitle").textContent.trim() : null;
        data.push({ avatar, name, profileURL, jobTitle, currentLocation, summary});
    });
    return data;
};

const getCurrentPage = () => {
    if (document.querySelector(".artdeco-pagination__pages--number") === null) {
        console.log("could not load");
        return 0;
    }
    const pages = Array.from(
        document.querySelector(".artdeco-pagination__pages--number").children
    );
    for (const page of pages) {
        if (
        page.classList.contains("active") &&
        page.classList.contains("selected")
        ) {
            currentPage = page.children[0].children[0].textContent;
        }
    }
    const totalPages = pages[pages.length - 1].children[0].children[0].textContent;
    return { currentPage, totalPages };
};

const extractData = () => {
    const {currentPage, totalPages} = getCurrentPage();
    const list = document.querySelector(".reusable-search__entity-result-list");
    if (list !== null) {
        const data = collectData(list);
        return {page:currentPage, totalPages, data};
    }
};

const inspectMode = async () => {
    setInspect(false);
    await chrome.tabs.sendMessage(tabDetails.id, { message: "mapData" });
};

const nextPageData = async () => {
    const listElements = Array.from(document.querySelectorAll('ul, ol, div')).filter(listElement => {
        return Array.from(listElement.attributes).some((attribute) => attribute.value.includes('list'))
    })
    for (const [index, list] of listElements.entries()) {
        list.setAttribute('list-id', index);
        Array.from(list.children).forEach((el, i) => {
            el.setAttribute("data-point",i)
        })
        highLightListElements(list.children, index);
    }
    const pageElements = document.querySelectorAll('.artdeco-pagination__pages > li');
    for (const pageBtn of pageElements) {
        const pageNumber = pageBtn.getAttribute('data-test-pagination-page-btn');
        const btnSpanElem = pageBtn.querySelector('button');
        btnSpanElem.setAttribute('page-point', pageNumber);
    }
}

const getDataByMarkers = async (dupSample) => {
    console.log('dupSample_', dupSample);
    let list = dupSample.listId;
    const data = Array.from(document.querySelector(`[list-id="${list}"]`).children).map((element, index) => {
        let fields = {};
        let blaBla = [dupSample];
        blaBla.forEach(({ datapointId, fieldName}) => {
            const datapoint = `${index}${datapointId.slice(1)}`
            let fieldValue = element.querySelector(`[data-point="${datapoint}"]`)
            if (fieldValue) {
                if (fieldValue.tagName === "IMG") {
                    fields[fieldName] = fieldValue.src;
                } else if (fieldValue.className === "info-url") {
                    fields[fieldName] = fieldValue.getAttribute('data-url');
                } else {
                    fields[fieldName] = fieldValue.textContent.trim();
                }
            } else { 
                fields[fieldName] = "----"
            }
        })
        return fields
    });
    console.log('datadata_', data);
    return data;
}


let mapContent = {};
let listElement = "";
let contents;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "Current") {
        const currentPageData = extractData();
        sendResponse({ response: currentPageData });
        
    }
    if (request.message === "currentPageMapping") {
        let isTrue = request.sample.every((obj) => obj.listId);
        if (!isTrue) {
            console.log("error: field values not from the same list")
        } else {
            let list = request.sample[0].listId;
            let data = Array.from(document.querySelector(`[list-id="${list}"]`).children).map((element, index) => {
                let fields = {};
                request.sample.forEach(({ datapointId, fieldName}) => {
                    const datapoint = `${index}${datapointId.slice(1)}`
                    let fieldValue = element.querySelector(`[data-point="${datapoint}"]`)
                    if (fieldValue) {
                        if (fieldValue.tagName === "IMG") {
                            fields[fieldName] = fieldValue.src;

                        } else if (fieldValue.className === "info-url") {
                            fields[fieldName] = fieldValue.getAttribute('data-url');
                        } else {
                            fields[fieldName] = fieldValue.textContent.trim();
                        }
                    } else { 
                        fields[fieldName] = "----"
                    }
                })
                return fields
            });

            //for (let index = 2; index < 5; index++) {
                
                const pageBtn = document.querySelector(`[page-point="2"]`);
                pageBtn.click();

                setTimeout(() => {
                    nextPageData();
                    const datapointId = request.configDataPointId;
                    console.log('datapointId___', datapointId);
                    data = getDataByMarkers(datapointId);
                    console.log('datal', data);

                    //sendResponse({page: "Mapped from Current Page", data});
                    
                    // 0,0,0,1,0,0,0,0,0,0,1,0
                    //console.log('mapContent_nextPage', mapContent);
                }, 1800);
            //}
            
            sendResponse({page: "Mapped from Current Page", data})
        }
    }
    if (request.message === "getPageDetails") {
        const { totalPages, currentPage } = getCurrentPage();
        sendResponse({ totalPages, currentPage });
    }
    if (request.message === "mapData") {
        /**
         * Read current page config from local storage, Same for data
         */
        const listElements = Array.from(document.querySelectorAll('ul, ol, div')).filter(listElement => {
            return Array.from(listElement.attributes).some((attribute) => attribute.value.includes('list'))
        })
        for (const [index, list] of listElements.entries()) {
            list.setAttribute('list-id', index);
            Array.from(list.children).forEach((el, i) => {
                el.setAttribute("data-point",i)
            })
            highLightListElements(list.children, index);
        }
        const pageElements = document.querySelectorAll('.artdeco-pagination__pages > li');
        for (const pageBtn of pageElements) {
            const pageNumber = pageBtn.getAttribute('data-test-pagination-page-btn');
            const btnSpanElem = pageBtn.querySelector('button');
            btnSpanElem.setAttribute('page-point', pageNumber);
        }
    }
    if (request.message === "cancelMapData") {
        location.reload()
    }
    if (request.message === "getMappedContent") {
        /**
         * Store concated data in local storage, update config too, [page number], current page + 1
         */
        sendResponse(mapContent);
    }
    return true;
});

// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete') {
  
//       // do your things
  
//     }
// })

const highLightListElements = (cards, listId) => {
    contents = []
    for (const element of cards) {
        if (element.nodeType !== Node.TEXT_NODE && element.children.length > 0) {
            if (element.tagName === "A") {
                element.style.textDecoration = "underline";
                element.style.textDecorationStyle = "double";
                const infoTag = document.createElement("button");
                const text = document.createTextNode('i');
                infoTag.appendChild(text);
                infoTag.style.padding = "10px";
                infoTag.style.color = "blue";
                infoTag.style.border = "1px solid #000";
                infoTag.style.margin = "1px"
                infoTag.className = "info-url";
                infoTag.setAttribute('data-url', element.href)
                element.prepend(infoTag);
            } else if (element.tagName === "P") {
                element.style.border = "1px solid red";
            } else if (element.tagName === "DIV" && element.textContent) {
                element.style.textDecoration = "underline";
            } else if (element.tagName === "IMG") {
                element.style.border = "1px solid #444";
            }
            Array.from(element.children).forEach((el, i) => { 
                let datapoint = `${element.getAttribute('data-point')},${i}`
                el.setAttribute('data-point', datapoint);
            })
            highLightListElements(element.children, listId);
        } else if (element.textContent.trim() !== "" && element.parentElement.tagName !== "BUTTON") {
            if (element.tagName !== "BUTTON") { 
                element.style.background = "yellow";
                element.style.color = "red";
            }
        }
        
        element.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.style.color = "black";
            if (e.target.tagName === "IMG") {
                mapContent = {
                    listId,
                    dataPoint: e.target.getAttribute('data-point'),
                    content: e.target.src
                };
            } else if (e.target.className === "info-url") {
                mapContent = {
                    listId,
                    dataPoint: e.target.getAttribute("data-point"),
                    content: e.target.getAttribute("data-url"),
                };

            } else {
                mapContent = {
                    listId,
                    dataPoint: e.target.getAttribute("data-point"),
                    content: e.target.textContent.trim(),
                };
            }
            return false;
        };
    }
}