import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import DataTable from "react-data-table-component";
import { DeleteLeaveRequest, GetAllLeaves } from "../Services/LeaveActions";

const quaterMapper = {
  Quarter1: "Jan-Mar",
  Quarter2: "Apr-Jun",
  Quarter3: "Jul-Sep",
  Quarter4: "Oct-Dec",
};

function LeaveList() {
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  const id = useSelector((state) => state.userId);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {

      setError(null);

      try {

        const response = await GetAllLeaves(id);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const resultData = await response.json();

        if (resultData && resultData.length > 0) {
          setData(resultData);
          setFilteredData(resultData);
        } else {
          setError("No Leave requests found for the given ID");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  // Function to handle search query change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Filter data when search query changes
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(data); // Reset filtered data if the query is empty
    } else {
      const filtered = data.filter(
        (leave) =>
          leave.employeeId.toString().includes(searchQuery) ||
          leave.employeeName.toLowerCase().includes(searchQuery) ||
          leave.fromDate.toLowerCase().includes(searchQuery) ||
          leave.toDate.toLowerCase().includes(searchQuery) ||
          leave.totalDays.toString().includes(searchQuery) ||
          leave.status.toLowerCase().includes(searchQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  // Function to group leaves by quarter and filter by selected year
  const groupByQuarterAndYear = (leaves, year) => {
    const grouped = {
      Quarter1: [],
      Quarter2: [],
      Quarter3: [],
      Quarter4: [],
    };

    const filteredLeaves = leaves.filter((leave) => {
      const fromDate = new Date(leave.fromDate);
      return fromDate.getFullYear() === year; // Filter by the selected year
    });

    filteredLeaves.forEach((leave) => {
      const fromDate = new Date(leave.fromDate);
      const month = fromDate.getMonth(); // 0 - 11 (January is 0, December is 11)

      if (month >= 0 && month <= 2) {
        grouped.Quarter1.push(leave);
      } else if (month >= 3 && month <= 5) {
        grouped.Quarter2.push(leave);
      } else if (month >= 6 && month <= 8) {
        grouped.Quarter3.push(leave);
      } else if (month >= 9 && month <= 11) {
        grouped.Quarter4.push(leave);
      }
    });

    return { groupedLeaves: grouped, filteredLeaves };
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const { groupedLeaves, filteredLeaves } = groupByQuarterAndYear(
    filteredData,
    selectedYear
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleDelete = async (leaveId) => {

    try {
      
      const response = await DeleteLeaveRequest(leaveId);

      if (!response.ok) {
        throw new Error("Failed to delete leave request");
      }

      // Update data after deletion
      setData(data.filter((leave) => leave.leaveId !== leaveId));
      setFilteredData(filteredData.filter((leave) => leave.leaveId !== leaveId));
      setShowModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const openDeleteModal = (leaveId) => {
    setLeaveIdToDelete(leaveId);
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open");
  };

  const columns = [
    {
      name: "Employee ID",
      selector: (row) => row.employeeId,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employeeName,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => formatDate(row.fromDate),
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => formatDate(row.toDate),
      sortable: true,
    },
    {
      name: "Total Days",
      selector: (row) => row.totalDays,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`status-badge ${
            row.status.toLowerCase() === "approved"
              ? "status-approved"
              : row.status.toLowerCase() === "rejected"
              ? "status-rejected"
              : "status-pending"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        row.status === "Pending" ? (
          <div className="button-container">
            <button className="edit">
              <Link to={`/edit/${row.leaveId}`}>Edit Request</Link>
            </button>
            <button className="cancel" onClick={() => openDeleteModal(row.leaveId)}>
              Cancel Request
            </button>
          </div>
        ) : (
          <span style={{ color: "gray" }}>
            Can't perform actions, Leave has already been {row.status}
          </span>
        )
      ),
    },
  ];

  useEffect(() => {
    document.title = "Employee Dashboard-LMS";
  }, []);

  return (
    <>
      <h1>List of Leaves</h1>
      <div className="content-wrapper">
        <div className="app">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search leaves..."
              className="search-input"
              value={searchQuery}
              onChange={(event) => handleSearch(event)}
            />
          </div>

          {/* Dropdown to select year */}
          <div className="year-dropdown">
            <label htmlFor="">Select an Year</label>
            <select value={selectedYear} onChange={handleYearChange}>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          {Object.keys(groupedLeaves).map((quarter) => (
            <div key={quarter}>
              <h2>{`${quarter} (${quaterMapper[quarter]})`}</h2>
              {groupedLeaves[quarter].length === 0 ? (
                <p style={{ textAlign: "center", color: "red" }}>
                  No leaves for {quarter} in {selectedYear}
                </p>
              ) : (
                <DataTable
                  columns={columns}
                  data={groupedLeaves[quarter]}
                  highlightOnHover
                  pointerOnHover
                  responsive
                />
              )}
            </div>
          ))}

          {/* Display combined data for the selected year */}
          <h2>All Leaves for {selectedYear}</h2>
          {filteredLeaves.length === 0 ? (
            <p>No Leave requests found for {selectedYear}</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredLeaves}
              highlightOnHover
              pointerOnHover
              responsive
            />
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={showModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        leaveId={leaveIdToDelete}
        title="Leave Request"
      />
    </>
  );
}

export default LeaveList;