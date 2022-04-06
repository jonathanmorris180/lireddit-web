import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const [createPost] = useCreatePostMutation();
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async values => {
                    const response = await createPost({
                        variables: { input: values },
                        update: cache => {
                            cache.evict({ fieldName: "posts" });
                        }
                    });
                    if (!response.errors) router.push("/");
                }}
            >
                {({ isSubmitting }) => {
                    return (
                        <Form>
                            <InputField
                                name="title"
                                placeholder="title"
                                label="Title"
                            ></InputField>
                            <Box mt={4}>
                                <InputField
                                    textarea
                                    name="text"
                                    placeholder="text..."
                                    label="Body"
                                ></InputField>
                            </Box>
                            <Button
                                mt={4}
                                type="submit"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Create Post
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(CreatePost);
