import React from 'react'
import { Link } from 'react-router-dom'
const UpperHeader = () => {
    return (
        <>
            <div className="upper head" style={{ backgroundColor: 'transparent' }}>
                <div className="container" style={{ maxWidth: '100%', padding: '0' }}>                
                        <Link to="/offline-order" className="info-box info-box-icon-left" style={{ background: '#F39655', color: 'white', padding: '10px' }}>
                        <div >
                        <div className='d-flex align-items-center'>
                         <i className="fas fa-phone" style={{ fontSize: '11px' }}></i>
                            <div className="info-box-content pt-1">
                                <h4>Offline order</h4>
                                <p>Call:8553666877</p>
                                <p className="text-body"></p>
                            </div></div> </div> 
                        </Link>
               
                        <Link to="/collection/special-offers" className="info-box info-box-icon-left" style={{ background: '#EF6A37', color: 'white', padding: '10px' }}>
                        <div>
                        <div className='d-flex align-items-center'>
                        <i className="fas fa-gift"></i>
                            <div className="info-box-content">
                                <h4>Special Offers</h4>
                                <p className="text-body"></p>
                            </div> </div>  </div>
                        </Link>
 
         {/* reorder */}
                 {localStorage.getItem("user") === null ?
                    <Link to="/login" className="info-box info-box-icon-left" style={{ background: '#F39655', color: 'white', padding: '10px' }}>
                    <div className='d-flex align-items-center'>
                        <i className="fas fa-history"></i>
                        <div className="info-box-content">
                        <h4>Re-Order</h4>
                            <p className="text-body"></p>
                        </div> </div>
                    </Link>:
                    <Link to="/order" className="info-box info-box-icon-left" style={{ background: '#F39655', color: 'white', padding: '10px' }}>
                    <div className='d-flex align-items-center'>
                        <i className="fas fa-history"></i>
                        <div className="info-box-content">
                        <h4>Re-Order</h4>
                            <p className="text-body"></p>
                        </div> </div>
                    </Link>}
                   
                </div>
            </div>
        </>
    )
}

export default UpperHeader
