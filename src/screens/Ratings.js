import React from 'react'

const Ratings = ({value}) => {

  return (
     <div>
   <span>
   <i className={ value >= 1 ? 'fas fa-star text-warning' : value >= 1 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
     <i className={ value >= 2 ? 'fas fa-star text-warning' : value >= 2 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
     <i className={ value >= 3 ? 'fas fa-star text-warning' : value >= 3 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
     <i className={ value >= 4 ? 'fas fa-star text-warning' : value >= 4 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      <i className={ value >= 5 ? 'fas fa-star text-warning' : value >= 5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
   </span>
 
  </div>
  )
}

export default Ratings;