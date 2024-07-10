import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginInfo);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
        
            <Form onSubmit={handleSubmit}>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "2rem" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Control
                                type="text"
                                placeholder="name"
                                name="name"
                                value={loginInfo.name}
                                onChange={handleChange}
                            />
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={loginInfo.password}
                                onChange={handleChange}
                            />
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            {error && (
                                <Alert variant="danger">
                                    <p>{error}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Login;
