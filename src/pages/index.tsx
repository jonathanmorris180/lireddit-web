import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Spacer,
    Stack,
    Text
} from "@chakra-ui/react";
import NextLink from "next/link";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null as string | null
        },
        notifyOnNetworkStatusChange: true
    });
    const { data: meData } = useMeQuery();

    if (!loading && !data) {
        return <div>Query failed. Error: {error?.message}</div>;
    }

    return (
        <>
            {loading && !data ? (
                <div>Loading...</div>
            ) : (
                <Layout variant="regular">
                    <Stack spacing={8}>
                        {data!.posts.posts.map(p => (
                            <Flex
                                key={p.id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                            >
                                <UpdootSection post={p} />
                                <Flex direction="column" flex={1}>
                                    <NextLink
                                        href="/post/[id]"
                                        as={`/post/${p.id}`}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {p.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Text>Posted by: {p.creator.username}</Text>
                                    <Spacer />
                                    <Flex bottom={0}>
                                        <Text flex={1} mt={4}>
                                            {p.textSnippet}
                                        </Text>

                                        {meData?.me?.id !==
                                        p.creator.id ? null : (
                                            <Box ml="auto">
                                                <EditDeletePostButtons
                                                    id={p.id}
                                                    creatorId={p.creator.id}
                                                />
                                            </Box>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        ))}
                    </Stack>

                    {data && data.posts.hasMore ? (
                        <Flex>
                            <Button
                                isLoading={loading}
                                m="auto"
                                my={8}
                                onClick={() => {
                                    fetchMore({
                                        variables: {
                                            limit: variables?.limit,
                                            cursor: data.posts.posts[
                                                data.posts.posts.length - 1
                                            ].createdAt
                                        }
                                    });
                                }}
                            >
                                Load More
                            </Button>
                        </Flex>
                    ) : null}
                </Layout>
            )}
        </>
    );
};

export default withApollo({ ssr: true })(Index);
