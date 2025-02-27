import React from 'react'
import "./RevenueCard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/'
import { 
    faClipboard, 
    faFaceAngry, 
    faArrowTrendUp, 
    faArrowTrendDown, 
    faBuildingColumns,
    faWallet,
    faUsers} from "@fortawesome/free-solid-svg-icons";
import { faClipboard as farClipboard } from "@fortawesome/free-regular-svg-icons";


const RevenueCard = () => {
  return (
    <div className='revenue-card'>
      <div className='revenue-balance'>
        <p>My Balance</p>
      </div>
      <div className='revenue-amount'>
        <h3>$117,000.43</h3>
      </div>
      <div className='revenue-small-cards'>
        <div className='income-card'>
            <div className='income-card-icon'>
                <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
            <div className='income-card-details'>
                <h4>$13,321.12</h4>
                <p>Income</p>
            </div>
        </div>
        <div className='expense-card'>
            <div className='expense-card-icon'>
                <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
            <div className='expense-card-details'>
                <h4>$13,321.12</h4>
                <p>Expense</p>
            </div>
        </div>
      </div>
      <div className="revenue-property">
        <div className='revenue-property-icon'>
            <FontAwesomeIcon icon={faBuildingColumns} />
        </div>
        <div className='revenue-property-details'>
            <div className='revenue-property-head'>
                <h4>Property</h4>
                <p>15.780</p>
            </div>
            <div className='revenue-property-progressbar'>
                <progress id="file" value="72" max="100"> 72% </progress>
            </div>
            <div className='revenue-property-update'>
               <p> 60% of Target</p>
            </div>
        </div>
      </div>
      <div className="revenue-revenue">
        <div className='revenue-revenue-icon'>
            <FontAwesomeIcon icon={faWallet} />
        </div>
        <div className='revenue-revenue-details'>
            <div className='revenue-revenue-head'>
                <h4>Revenue</h4>
                <p>$78.3M</p>
            </div>
            <div className='revenue-revenue-progressbar'>
                <progress id="file" value="80" max="100"> 72% </progress>
            </div>
            <div className='revenue-revenue-update'>
                <p>80% of Target</p>
            </div>
        </div>
      </div>
      <div className="revenue-customer">
        <div className='revenue-customer-icon'>
            <FontAwesomeIcon icon={faUsers} />
        </div>
        <div className='revenue-customer-details'>
            <div  className='revenue-customer-head'>
                <h4>Customer</h4>
                <p>9,154</p>
            </div>
            <div  className='revenue-customer-progressbar'>
                <progress id="file" value="40" max="100"> 72% </progress>
            </div>
            <div className='revenue-property-update'>
                <p>40% of Target</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueCard
