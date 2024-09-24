import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// material-ui
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// project import
import Dot from 'components/@extended/Dot';

function createData(count, id, date, time, fullName, phoneNumber, email, bookingService, description) {
  return { count, id, date, time, fullName, phoneNumber, email, bookingService, description };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'count', align: 'left', disablePadding: false, label: 'Ordinal number' },
  { id: 'date', align: 'left', disablePadding: true, label: 'Date' },
  { id: 'time', align: 'right', disablePadding: true, label: 'Time' },
  { id: 'fullname', align: 'right', disablePadding: false, label: 'Full Name' },
  { id: 'phonenumber', align: 'right', disablePadding: false, label: 'Phone Number' },
  { id: 'email', align: 'left', disablePadding: false, label: 'Email' },
  { id: 'bookingSerive', align: 'left', disablePadding: false, label: 'Booking Serive' },
  { id: 'description', align: 'left', disablePadding: false, label: 'Description' }
];

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

OrderTableHead.propTypes = { order: PropTypes.string.isRequired, orderBy: PropTypes.string.isRequired };
OrderStatus.propTypes = { status: PropTypes.number.isRequired };

export default function OrdersTable({ searchValue }) {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('count');
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    const token = localStorage.token;
    axios.get('http://localhost:8082/api/bookings/getAll', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;
        const now = new Date(); // Thời gian hiện tại

        const transformedRows = data
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            // Kiểm tra xem bản ghi có trước thời gian hiện tại hay không
            const isPastA = dateA < now;
            const isPastB = dateB < now;

            // Nếu cả hai bản ghi đều trước thời gian hiện tại, sắp xếp giảm dần theo ngày
            if (isPastA && isPastB) {
              return dateB - dateA;
            }
            // Nếu bản ghi A trước thời gian hiện tại, cho nó xuống dưới
            if (isPastA) {
              return 1;
            }
            // Nếu bản ghi B trước thời gian hiện tại, cho nó xuống dưới
            if (isPastB) {
              return -1;
            }
            // Nếu cả hai bản ghi đều sau thời gian hiện tại, sắp xếp giảm dần theo ngày
            return dateB - dateA;
          })
          .map((item, index) =>
            createData(
              index + 1,
              item.id,
              item.date || '',
              item.time || '',
              item.fullName || '',
              item.phoneNumber || '',
              item.email || '',
              item.bookingService || '',
              item.description || ''
            )
          );
        setRows(transformedRows);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  function getBookingServiceText(bookingService) {
    switch (bookingService) {
      case "1":
        return 'Manicure';
      case "2":
        return 'Pedicure';
      case "3":
        return 'Manicure + Pedicure';
      case "4":
        return 'Cosmetics';
      default:
        return 'Unknown Service';
    }
  }
  // Filter rows based on search value
  // const filteredRows = rows.filter(row =>
  //   (row.phoneNumber && row.phoneNumber.includes(searchValue)) ||
  //   (row.email && row.email.includes(searchValue))
  // );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const onDelete = (id) => {
    Swal.fire({
      title: 'Do you want to delete this booking?',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.token;
        axios
          .delete(`http://localhost:8082/api/bookings/delete/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then((response) => {
            console.log('Response:', response);
            if (response.status == 204) {
              Swal.fire('Deleted!', '', 'success');
              getAll();
            } else {

            }
          })
          .catch((error) => {
            console.error('Error deleting booking:', error);
            Swal.fire('Error', 'Could not delete booking.', 'error');
          });
      }
    });
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (searchValue.trim() !== '') {
      setFilteredRows(rows.filter(row => row.phoneNumber.includes(searchValue) || row.email.includes(searchValue)));
    } else {
      setFilteredRows(rows);
    }
  }, [searchValue, rows]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const now = new Date();

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(currentItems, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              const rowDate = new Date(row.date);

              const isPast = rowDate < new Date().setHours(0, 0, 0, 0);
              const isFuture = rowDate > new Date().setHours(23, 59, 59, 999);
              const isToday = rowDate.toDateString() === now.toDateString();

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: isPast ? '#ffcccc' : isFuture ? '#ccffcc' : 'inherit',
                  }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{indexOfFirstItem + index + 1}</Link>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right">{row.fullName}</TableCell>
                  <TableCell align="right">{row.phoneNumber}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{getBookingServiceText(row.bookingService)}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">
                    <button
                      className='btn btn-danger'
                      onClick={() => onDelete(row.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} sx={{ mt: 2, mb: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Pagination
          count={Math.ceil(filteredRows.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Box>
  );
}

OrdersTable.propTypes = {
  searchValue: PropTypes.string.isRequired
};
