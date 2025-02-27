import { Link } from "react-router";

export function Home(){
    
    return(
        <>
        <div>Home</div>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        </>
        
    )
}