import {Navigate, Outlet} from 'react-router-dom';
import {useAuthContext} from './authContext';

export default function Public(){
    const {isAuthenticated,IdUser} = useAuthContext();
    const Home = <Navigate to='/home'/>
    // const Panel = <Navigate to='/intraner/home/management/panel'/>
    console.log(isAuthenticated,IdUser)
    if(isAuthenticated){
        return Home
        // switch (IdUser) {
        //     case 1:
        //        return Home
        //         break;
        //     case 2:
        //         return Panel
        //         break;
        //     default:
        //         break;
        // }
       
    }
    return (<Outlet/>)
}