import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

export const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    console.log("response: ", response);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => {
                    return (
                        <Form>
                            <InputField
                                name="usernameOrEmail"
                                placeholder="username or email"
                                label="username or email"
                            ></InputField>
                            <Box mt={4}>
                                <InputField
                                    name="password"
                                    placeholder="password"
                                    label="password"
                                    type="password"
                                ></InputField>
                            </Box>
                            <Flex mt={2}>
                                <NextLink href="/forgot-password">
                                    <Link ml="auto">forgot password?</Link>
                                </NextLink>
                            </Flex>
                            <Button
                                mt={4}
                                type="submit"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Login
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
