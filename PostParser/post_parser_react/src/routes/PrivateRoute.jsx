import React, {useState} from 'react';
import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({ component: Component, auth, redirect, ...rest }) => {
    const [is_auth, _] = useState(!!localStorage.getItem('token'));

    return (<Route
                {...rest}
                render={
                    props => is_auth === true
                    ? <Component {...props} />
                    : <Redirect to='/login/'/>
                }
  />)
}
export default PrivateRoute;