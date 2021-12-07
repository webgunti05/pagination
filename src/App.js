import React, {useState, useEffect} from "react";
import "./App.css";
 function App() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState([])
  const [pageNum, setPageNum] = useState([]);
  const [page, setPage] = useState(0);
  const [findIdx, setFindIdx] = useState(1)
  const [activeBtn, setActiveBtn] = useState(false);
  const [backBtn, setBackBtn] = useState(false)
  const [finalPages, setFinalPages] = useState([]);
  const [slicedPages, setSlicedPages] = useState([]);
  const [startItem, setStartItem] = useState();
  const [endItem, setEndItem] = useState()
  let dotsPages = '...';

//let someDtaApi12 = "https://mocki.io/v1/9d5d3969-e8d7-4569-8a9b-5c76707ce266"
let someDtaApi6 = "https://mocki.io/v1/65c2b1ef-f5bd-46ca-be48-dba086c7f66d"
  const getData = async () => {
    const res = await fetch(someDtaApi6);
    const json = await res.json();
    setUsers(json);
    setTotal(json.data.slice(0,1))
  };
  useEffect(() => {
    getData();
  }, []);


  let dataObj = users?.data; // to get array of users
  let lastItem = dataObj && dataObj[dataObj.length-1]; //to find the last item

  const setConditionForLastItem = (dataId, lastData) => {
    if(dataId?.id === lastData?.id){
      setActiveBtn(true)
    } else{
     setActiveBtn(false)
    }
  }
  const setConditionForFirstItem = (dataId) => {
    if(dataId?.id === 1){
      setBackBtn(true)
      } else{
        setBackBtn(false)
     }
  }

  const GetPaginationItems = () => {
    for(let i = 0; i < dataObj?.length; i++){
      let valMod = i+1;
      pageNum.push(valMod)
    }
    setPageNum([...new Set([...pageNum])])
  }

  useEffect(() => {
    GetPaginationItems();
  }, [users]);





  const onValueClick = val => {
    setPage(val)
    let updateData = dataObj?.filter((item, index) => index === val-1);
    setTotal(updateData)
    setFindIdx(val)
    setBackBtn(false)
    setActiveBtn(false)
    setConditionForLastItem(updateData[0], lastItem)
    setConditionForFirstItem(updateData[0]);
    let sliceItemsForOne = pageNum.slice(0, 3);
    let sliceItemsForSix = pageNum.slice(3,endItem);
    if(val === 1){
      let addUpdateData = [...sliceItemsForOne, dotsPages, endItem]
      setFinalPages(addUpdateData)
    } 
    if(val === 6){
      let addUpdateData = [startItem, dotsPages, ...sliceItemsForSix]
      setFinalPages(addUpdateData)
    }
    // if(isNaN(val)){
    //   let addUpdateData = [startItem, dotsPages, ...sliceItemsForSix]
    //   setFinalPages(addUpdateData)
    //   setPage(4)
    //   setFindIdx(4)
    //   let updateData = dataObj?.filter((item, index) => index === val-1);
    //   setTotal(updateData)
    // }
  }



  const onNext = () => {
   for(let i = 0; i < dataObj.length; i++){
    setFindIdx(findIdx + 1)
   }
   console.log(findIdx)
   let nextData = dataObj?.filter((item, index) => index === findIdx);
   setTotal(nextData)
   setConditionForLastItem(nextData[0], lastItem)
   setBackBtn(false)
   let sliceItems = pageNum.slice(page,endItem);
   setPage(findIdx+1)
   for(let i = 0; i < pageNum.length; i++){
    if(findIdx+1 === 4){
      let addUpdateData = [startItem, dotsPages, ...sliceItems]
      setFinalPages(addUpdateData)
    } 
   }
  }
  
  const onPrev = () => {
    let findPrevId = findIdx -1;
    for(let i = dataObj.length; i > 0; i--){
      setFindIdx(findPrevId)
     }
     
    let nextData = dataObj?.filter((item, index) => index === findPrevId-1);
    setTotal(nextData)
    setConditionForFirstItem(nextData[0]);
   setActiveBtn(false)
   setPage(findIdx-1)
   let sliceItems = pageNum.slice(0,3);
   for(let i = pageNum.length; i > 0; i--){
    if(findIdx-1 === 3){
      let addUpdateData = [...sliceItems, dotsPages, endItem]
      setFinalPages(addUpdateData)
    } 
   }
  }


  useEffect(() => {
    let lastPageItem = pageNum && pageNum[pageNum.length - 1];
    setEndItem(lastPageItem);
    setStartItem(pageNum[0])
    let slicedItems = pageNum.slice(page, 3);
   
    setSlicedPages(slicedItems)
    let someData = [...slicedItems, dotsPages, lastPageItem]
    setFinalPages(someData)
  }, [pageNum]);


  const PageButtonComponent = ({onClick, item, idx}) => {

    return(
      <>
       <button style={isNaN(item) ? {pointerEvents: 'none'} : {cursor: 'pointer'}}  className={item === findIdx ? 'activeButton' : ''} onClick={onClick}>
        {item}
      </button>
      </>
    )
  }

  return (
    <div className="App">
      <div className="flex">
        {total?.length &&
          total?.map((user) => {
            return (
              <div key={user.id}>
                <p>
                  <strong>{user.first_name}</strong>
                </p>
                <p>{user.email}</p>
                <img key={user.avatar} src={user.avatar} />
              </div>
            );
          })}
      </div>
      <div className="flex">
      <button onClick={onPrev} disabled={backBtn || findIdx === 1}>Prev</button>
        {finalPages?.map((item, index) => (
          <PageButtonComponent key={item} onClick={() => onValueClick(item)} item={item} idx={index} />
          // <button className={item === findIdx ? 'activeButton' : ''} >{item}</button> 
        ))}
        {/* <span>...</span>
        <button  onClick={() => onValueClick()}>{lastPageItem}</button> */}
        <button onClick={onNext} disabled={activeBtn} >Next</button>
      </div>
    </div>
  );
}

export default App;
