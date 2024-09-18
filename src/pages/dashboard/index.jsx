import React, { useState, useEffect } from 'react';
import { Grid, Typography, FormControl, OutlinedInput, InputAdornment } from '@mui/material';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import OrdersTable from './OrdersTable';

export default function DashboardDefault() {
  const [searchValue, setSearchValue] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [manicureCount, setManicureCount] = useState(0);
  const [pedecureCount, setPedecureCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [cosmeticsCount, setCosmeticsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(new Date());

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.trim());
    setPage(1);
  };

  useEffect(() => {
    if (searchValue.trim() !== '') {
      axios.get(`http://localhost:8082/api/bookings/getPhoneNumberOrEmail`, {
        params: {
          phoneNumber: searchValue,
          email: searchValue
        }
      })
        .then(response => {
          const data = response.data;
          setBookingData(data);
          setTotalBookings(data.length);
          const countManicureCount = data.filter(record => record.bookingService === "1").length;
          setManicureCount(countManicureCount);
          const countPedicureCount = data.filter(record => record.bookingService === "2").length;
          setPedecureCount(countPedicureCount);
          const countComboCount = data.filter(record => record.bookingService === "3").length;
          setComboCount(countComboCount);
          const countCosmeticsCount = data.filter(record => record.bookingService === "4").length;
          setCosmeticsCount(countCosmeticsCount);
          setPage(1);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [searchValue]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
          <OrdersTable searchValue={searchValue} data={bookingData} page={page} itemsPerPage={itemsPerPage} />
        </MainCard>
      </Grid>
    </Grid>
  );
}