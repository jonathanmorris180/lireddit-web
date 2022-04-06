import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { withApollo } from "../../../utils/withApollo";

const EditPost = ({}) => {
    const router = useRouter();
    const { data, loading } = useGetPostFromUrl();
    const [updatePost] = useUpdatePostMutation();
    if (loading) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find the post.</Box>
            </Layout>
        );
    }

    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async values => {
                    const { errors } = await updatePost({
                        variables: {
                            id: data.post?.id ? data.post.id : -1,
                            ...values
                        }
                    });
                    if (errors) console.error(errors);
                    router.back();
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
                                Edit Post
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(EditPost);
