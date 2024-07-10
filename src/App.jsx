import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Register from './Pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import NavBar from './Compontes/NavBar';
import { AuthContext,  } from './Context/AuthContext';
import { ChatContextProvider } from './Context/ChatContent';
import { useContext } from 'react';

function App() {
  const {user}= useContext(AuthContext)
  return (

    <ChatContextProvider  user={user}>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
