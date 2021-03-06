import React from 'react';

import cross from '../images/SVG/SVG/greyCross.svg'



export function SearchCriteria({worker,searchValue,searchbar, setCriteriaOpen,setSearchCriteria, videolist}){


    const [chosen, setChosen] = React.useState("Title")

    React.useEffect(
        function(){
            worker.postMessage({
                word: searchValue.current.value,
                list: videolist,
                field: chosen,
              }); 
        },[chosen]
    )

    console.log("COORD", searchbar.getBoundingClientRect().top, searchbar.getBoundingClientRect().left)
    return (
        <div className="search-criteria" style={{top:(searchbar.offsetTop+40)+"px", left:(searchbar.offsetLeft+70)+"px"}} >
            <div key="title" className={`search-icon ${chosen==="Title"?" search-chosen":""}`} onClick={function(e){if(chosen==="Title"){setChosen(" ");setSearchCriteria("Title")} else {setChosen("Title");setSearchCriteria("Title")}}} >
                T
         </div>
         <div key="uploader" className={`search-icon ${chosen==="StartedByUsername"?" search-chosen":""}`} onClick={e=>{if(chosen==="StaredByUsername"){setChosen("");setSearchCriteria("Title")} else {setChosen("StartedByUsername");setSearchCriteria("StartedByUsername")}}}>
                N
                </div>
         <div key="startdatetime" className={`search-icon ${chosen==="StartDateTime"?" search-chosen":""}`} onClick={e=>{ if(chosen==="StartDateTime"){setChosen("");setSearchCriteria("Title")} else {setChosen("StartDateTime");setSearchCriteria("StartDateTime")}}}>
                D
                </div>
            <div key="original" className={`search-icon ${chosen==="OriginalFileName"?" search-chosen":""}`} onClick={e=>{if(chosen==="OriginalFileName"){setChosen("");setSearchCriteria("Title")} else {setChosen("OriginalFileName");setSearchCriteria("OriginalFileName")}}}>
                O
                </div>

                <div style={{backgroundImage:`url(${cross})`}} onClick={e=>{setSearchCriteria("Title");setCriteriaOpen(false) }} className="close-search-criteria"></div>


        </div>
    )
}