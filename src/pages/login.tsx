import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

export const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({ options: values });
                    console.log("response: ", response);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="username"
                        ></InputField>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="password"
                                type="password"
                            ></InputField>
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Login;
