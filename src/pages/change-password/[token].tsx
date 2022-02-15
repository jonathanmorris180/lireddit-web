import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    const [tokenError, setTokenError] = useState("");
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    // Do something here
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        ></InputField>
                        {tokenError ? (
                            <Flex>
                                <Box color="red" mr={2}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password">
                                    <Link>click here to get a new one</Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button
                            mt={4}
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

// special Next.js function
ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
