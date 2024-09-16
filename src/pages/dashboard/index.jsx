import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import axios from 'axios'; // Import axios

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';
import Pagination from './Pagination';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [searchValue, setSearchValue] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [manicureCount, setManicureCount] = useState(0);
  const [pedecureCount, setPedecureCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [cosmeticsCount, setCosmeticsCount] = useState(0);
  const [itemsPerPage] = useState(10);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (searchValue.trim() !== '') {
      axios.get(`http://localhost:8082/api/bookings/getPhoneNumber/${searchValue}`)
        .then(response => {
          const data = response.data;
          setBookingData(data);
          setTotalBookings(data.length);
          const countManicureCount = data.filter(record => record.bookingService === "1").length;
          setManicureCount(countManicureCount);
          const countPedecureCount = data.filter(record => record.bookingService === "2").length;
          setPedecureCount(countPedecureCount);
          const countComboCount = data.filter(record => record.bookingService === "3").length;
          setComboCount(countComboCount);
          const countCosmeticsCount = data.filter(record => record.bookingService === "4").length;
          setCosmeticsCount(countCosmeticsCount);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [searchValue]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        {/* <Typography variant="h5">Dashboard</Typography> */}
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Total Booking Service" count={totalBookings.toLocaleString()} percentage={59.3} extra="35,000" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Total Manicure" count={manicureCount.toLocaleString()} percentage={70.5} extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Total Pedicure" count={pedecureCount.toLocaleString()} percentage={27.4} isLoss extra="1,943" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Total Manicure + Pedicure" count={comboCount.toLocaleString()} percentage={27.4} isLoss extra="$20,395" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Cosmetics" count={cosmeticsCount.toLocaleString()} percentage={27.4} isLoss extra="$20,395" />
      </Grid>
      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Booking list</Typography>
          </Grid>
          <Grid item />
          <FormControl align="right" sx={{ width: { xs: '100%', md: 250 } }}>
            <OutlinedInput
              size="small"
              id="header-search"
              startAdornment={
                <InputAdornment position="start" sx={{ mr: -0.5 }}>
                  <SearchOutlined />
                </InputAdornment>
              }
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              placeholder="Ctrl + K"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </FormControl>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable searchValue={searchValue} data={bookingData} /> {/* Pass data to OrdersTable */}
        </MainCard>
        <Grid className="text-center">
          <Pagination />
        </Grid>
      </Grid>
    </Grid>
  );
}
