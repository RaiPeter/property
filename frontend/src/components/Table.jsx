import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/'
import { 
    faSort} from "@fortawesome/free-solid-svg-icons";import "./Table.css"

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
          case "paid":
            return { backgroundColor: "#E6FAEE", color: "#50926E", padding: "5px 20px",  fontWeight: "bold",textTransform: "capitalize" }; // Green
          case "cancelled":
            return { backgroundColor: "#FFECEE", color: "#B32538", padding: "5px 20px", fontWeight: "bold",textTransform: "capitalize" }; // Yellow
          default:
            return {};
        }
      };
      

const Table = ({ rows }) => {
    const [sortedRows , setRows] =useState(rows);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    
    const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }

    const sortedData = [...sortedRows].sort((a,b) =>{
        if (typeof a[key] === "number") {
            return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
          } else {
            return direction === "asc"
              ? a[key].toString().localeCompare(b[key].toString())
              : b[key].toString().localeCompare(a[key].toString());
          }
    })
    setRows(sortedData);
    setSortConfig({ key, direction });
    };

    return (
    <div className='table'>
      <table>
        <thead>
            <tr>
                {Object.keys(rows[0])
                .filter((key) => key !== "id")
                .map((key,index) =>(
                    <th key={key} onClick={()=>sortData(key)}>
                        {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} {<FontAwesomeIcon icon={faSort} size='xs'/>}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {sortedRows.map((row,index)=>(
                <tr key={index}>
                    <td className="orders-cell">
                    <img src={row.image} alt={row.orders} className="profile-pic" />
                <div>
                  <p className="order-name">{row.orders}</p>
                  <p className="order-id">#{row.id}</p>
                </div>
              </td>
              <td>{row.date}</td>
              <td>{row.property_type}</td>
              <td>{row.property_name}</td>
              <td>
                <span style={getStatusStyle(row.status)}>{row.status}</span>
              </td>
              <td className="price-cell">${row.price.toLocaleString()}</td>
                </tr>
            ))
            }
        </tbody>
      </table>
    </div>
  )
}

export default Table
