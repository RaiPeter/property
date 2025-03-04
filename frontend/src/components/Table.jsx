import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import "./Table.css";

const Table = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  // Memoize sortedRows to prevent unnecessary re-renders
  const sortedRows = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data];
    if (!sortConfig.key) return sortedData;

    sortedData.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "_id") {
        aValue = a._id;
        bValue = b._id;
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortConfig.key === "land_range") {
        aValue = a.landDistribution.reduce(
          (sum, land) => sum + parseFloat(land.land_range || 0),
          0
        );
        bValue = b.landDistribution.reduce(
          (sum, land) => sum + parseFloat(land.land_range || 0),
          0
        );
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortConfig.key === "totalProperties") {
        aValue = a.landDistribution.reduce(
          (sum, land) => sum + (land.totalProperties || 0),
          0
        );
        bValue = b.landDistribution.reduce(
          (sum, land) => sum + (land.totalProperties || 0),
          0
        );
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sortedData;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Aggregate data for each row for display
  const getRowData = (row) => {
    const landRanges = row.landDistribution
      .map((land) => land.land_range)
      .join(", ") || "N/A";
    const totalProperties = row.landDistribution.reduce(
      (sum, land) => sum + (land.totalProperties || 0),
      0
    );

    return { landRanges, totalProperties };
  };

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("land_range")}>
              Land (in Kattha)
              <FontAwesomeIcon
                icon={
                  sortConfig.key === "land_range"
                    ? sortConfig.direction === "asc"
                      ? faSortUp
                      : faSortDown
                    : faSort
                }
              />
            </th>
            <th onClick={() => handleSort("_id")}>
              Location
              <FontAwesomeIcon
                icon={
                  sortConfig.key === "_id"
                    ? sortConfig.direction === "asc"
                      ? faSortUp
                      : faSortDown
                    : faSort
                }
              />
            </th>
            <th onClick={() => handleSort("totalProperties")}>
              Total no. of Lands
              <FontAwesomeIcon
                icon={
                  sortConfig.key === "totalProperties"
                    ? sortConfig.direction === "asc"
                      ? faSortUp
                      : faSortDown
                    : faSort
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const { landRanges, totalProperties } = getRowData(row);

            return (
              <tr
                key={row._id}
                onClick={() => navigate(`./${row._id}`)}
              >
                <td>{landRanges}</td>
                <td>{row._id}</td>
                <td>{totalProperties}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;