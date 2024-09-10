import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// third-party
import { NumericFormat } from 'react-number-format';
// project import
import Dot from 'components/@extended/Dot';

function createData(count, date, time, fullName, phoneNumber, email, description) {
  return { count, date, time, fullName, phoneNumber, email, description };
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
  { id: 'email', align: 'right', disablePadding: false, label: 'Email' },
  { id: 'description', align: 'right', disablePadding: false, label: 'Description' }
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

export default function OrderTable() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('count');

  useEffect(() => {
    const token = localStorage.token;

    axios.get('http://localhost:8082/api/bookings/getAll', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;
        const count = 1;
        const transformedRows = data.map(item => createData(
          count,
          item.date,
          item.time,
          item.fullName,
          item.phoneNumber,
          item.email,
          item.description
        ));
        setRows(transformedRows);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.count}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {index + 1}</Link>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right">{row.fullName}</TableCell>
                  <TableCell align="right">{row.phoneNumber}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
