import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axios from 'axios';

export default function AuthRegister() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [level, setLevel] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const strength = strengthIndicator(value);
    setLevel(strengthColor(strength));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setServerError('');
    axios.post('http://localhost:8082/api/auth/signup', {
      username: values.username,
      email: values.email,
      password: values.password
    })
      .then((response) => {
        alert('Register success!');
        navigate('/login');
      })
      .catch((error) => {
        setServerError(error.response?.data?.message || 'An error occurred during registration');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('Username is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username-signup">Username*</InputLabel>
                <OutlinedInput
                  id="username-signup"
                  type="text"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter username"
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
                {touched.username && errors.username && (
                  <FormHelperText error id="helper-text-username-signup">
                    {errors.username}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="demo@company.com"
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Stack>
            </Grid>
            {serverError && (
              <Grid item xs={12}>
                <FormHelperText error>{serverError}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Create Account
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
