import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useFormFields } from "../libs/hooksLib";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const displayNone = {
    display: "none"
  }

  const [error, setError] = useState({
    firstName: null,
    firstNameError: "Required",
    lastName: null,
    lastNameError: "Required",
    email: null,
    emailError: "Invalid email address",
    password: null,
    passwordError: "Min 6 characters"
  })

  const [fields, handleFieldChange] = useFormFields({});
  
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const validate = () => {
    let hasError = false
    const errors = {
      firstName: null,
      firstNameError: "Required",
      lastName: null,
      lastNameError: "Required",
      email: null,
      emailError: "Invalid email address",
      password: null,
      passwordError: "Min 6 characters"
    }
    if (!fields.firstName || fields.firstName.length === 0) {
      hasError = true;
      errors.firstName = true
    }
    if (!fields.lastName || fields.lastName.length === 0) {
      hasError = true;
      errors.lastName = true
    }
    if (!fields.email || fields.email.indexOf('@') === -1) {
      hasError = true;
      errors.email = true;
    }
    if (!fields.password || fields.password.length < 6) {
      hasError = true;
      errors.password = true;
    }
    setError(errors)
    return hasError
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (!error) {
      setHasSubmitted(true)
      try {
        const response = await fetch("api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            password: fields.password,
          }),
        });
        const parsedResponse = await response.json()
        if (parsedResponse.error) {
          setHasSubmitted(false)
          setError({
            ...error,
            emailAlreadyExists: true,
          })
        }
      } catch (err) {
        console.log(err.stack);
      }
    }   
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={hasSubmitted ? "" : fields.firstName}
                onChange={handleFieldChange}
                error={error.firstName}
                helperText={error.firstName ? error.firstNameError : ''}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={hasSubmitted ? "" : fields.lastName}
                onChange={handleFieldChange}
                error={error.lastName}
                helperText={error.lastName ? error.lastNameError : ''}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={hasSubmitted ? "" : fields.email}
                onChange={handleFieldChange}
                error={error.email}
                helperText={error.email ? error.emailError : ''}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={hasSubmitted ? "" : fields.password}
                onChange={handleFieldChange}
                error={error.password}
                helperText={error.password ? error.passwordError : ''}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <h4 style={error.emailAlreadyExists ? null : displayNone}>Email already taken.</h4>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => handleSubmit(e)}
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
