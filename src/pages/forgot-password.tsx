import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async values => {
                    await forgotPassword({ variables: values });
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box>
                            If an account with that email exists, we sent you an
                            email.
                        </Box>
                    ) : (
                        <Form>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                                type="email"
                            ></InputField>
                            <Button
                                mt={4}
                                type="submit"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Forgot password
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
