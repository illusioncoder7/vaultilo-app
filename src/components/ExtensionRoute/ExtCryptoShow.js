import React, { useState } from "react";
import "../Sidebar.css";
import {Link ,withRouter} from 'react-router-dom';
import cryptoDetailView from "./cryptoDetailView";




 function ExtCryptoShow(props) {
  const credentials=
    props.credentials ===null ? [] : JSON.parse(props.credentials);
  const subType=props.match.params.subType
  const items = credentials.filter(
    credential =>  credential.subType === subType
  ); 
  
  const imageUrls=[
      {label:"icon" ,name:"Icon",value:"https://icon.foundation/resources/image/og-img.png"} ,
      {label:"ethereum" ,name:"Ethereum",value:"data:image/jpeg;base64,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"},
      {label:"bitcoin" ,name:"Bitcoin", value:"https://i1.pngguru.com/preview/781/878/330/button-ui-requests-bitcoin-logo-icon-png-clipart.jpg"},
      {label:"other" , name:"Other",value:"https://mpng.pngfly.com/20180319/qye/kisspng-bitcoin-cryptocurrency-wallet-ethereum-wallet-icon-flatastic-4-iconset-custom-icon-de-5ab080800349e1.2701896315215166720135.jpg"},
      {label:"ripple" , name:"Ripple",value:"data:image/png;base64,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"}
  ]

  const imageUrl= imageUrls.filter(image=> image.label==subType)
  console.log("imageUrl",imageUrl[0].value)
  
   const handleView = (items) => {
      console.log(items)
      // const {history}=props
      // history.push("/items/all")
    return <cryptoDetailView items={items}/>
  }


  return (
      <div classname="ui segment">
          <Link to="/extension/view">
              <button>
                  <i className="fa fa-arrow-left"></i>
                    Back
                    </button>
                    </Link>
                    <span className="nav-title">{`${imageUrl[0].name} Wallet List`}</span>
    <div className="ui list">
        {items.map(items =>{
            const {walletAddress,walletName}=items
            return(
                <div class="item"  >
                   <img class="ui tiny image" src={imageUrl[0].value} />
                   
                    <div class="content">
                    <span onClick={()=>{handleView(items)}}><i class="fa fa-edit"></i></span>
                     <a class='header'>{walletName}</a>
            <a class='description'>{`${walletAddress.slice(0,8)}......${walletAddress.slice(-8)}`}</a>
                        

                </div>
                
                <div class="ui fitted divider"></div>
                </div>
                
            )
        })}
        
        
    </div>
    </div>
  );
}


export default withRouter(ExtCryptoShow);