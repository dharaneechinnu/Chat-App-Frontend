import { useContext } from 'react';
import { Container, Nav, Navbar, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Notification from './Chat/Notification';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { useState } from 'react';
import logo from '../assets/logo.svg'
const NavBar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <Navbar bg='dark' className='mb-4' style={{ height: "4rem" }}>
            <Container>
                <h2>
                    <Link to="/" className='link-light text-decoration-none'>
                    <img src={logo} alt="logo" style={{ height: "3rem" }}/>
                    </Link>
                </h2>
                <Nav>
                    <Stack direction='horizontal' gap={3}>
                        {!user && (
                            <>
                                <Link to="/login" className='link-light text-decoration-none'>Login</Link>
                                <Link to="/register" className='link-light text-decoration-none'>Register</Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Notification />
                                <Link to="/login" onClick={logout} className='link-light text-decoration-none'>Logout</Link>
                            </>
                        )}
                        <button onClick={handleFullscreen} className='btn btn-outline-light'>
                            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                        </button>
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;
