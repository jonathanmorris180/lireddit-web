import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    // Do something here
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPasssword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        ></InputField>
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

export default ChangePassword;
