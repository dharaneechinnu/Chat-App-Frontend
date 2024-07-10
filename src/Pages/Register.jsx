import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";

const Register = () => {
    const { registerInfo, updateRegisterInfo, register, error } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        register(registerInfo);
    };

    return (
        <>
        
            <Form onSubmit={handleSubmit}>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "2rem" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                onChange={(e) => updateRegisterInfo({ name: e.target.value })}
                            />
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                onChange={(e) => updateRegisterInfo({ email: e.target.value })}
                            />
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => updateRegisterInfo({ password: e.target.value })}
                            />
                            <Button variant="primary" type="submit">
                                Register
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

export default Register;
