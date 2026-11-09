import React,{useEffect} from 'react'

function OutOfStock({productName}) {

const productArr=[]

  return (
    <h5 style={{color:"red",marginBottom:10,fontWeight:500}}>
      Following item(s) in your cart have been either removed or the quantity has been updated due to unavailability: {productName}.
    </h5>
  )
}

export default OutOfStock
