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
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as string | null
    });
    const [{ data, error, fetching }] = usePostsQuery({
        variables
    });

    if (!fetching && !data) {
        return <div>Query failed. Error: {error?.message}</div>;
    }

    return (
        <>
            {fetching && !data ? (
                <div>Loading...</div>
            ) : !fetching && !data ? null : (
                <Layout variant="regular">
                    <Stack spacing={8}>
                        {data!.posts.posts.map(p =>
                            !p ? null : (
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
                                        <Text>
                                            Posted by: {p.creator.username}
                                        </Text>
                                        <Spacer />
                                        <Flex bottom={0}>
                                            <Text flex={1} mt={4}>
                                                {p.textSnippet}
                                            </Text>
                                            <Box ml="auto">
                                                <EditDeletePostButtons
                                                    id={p.id}
                                                    creatorId={p.creator.id}
                                                />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                        )}
                    </Stack>

                    {data && data.posts.hasMore ? (
                        <Flex>
                            <Button
                                isLoading={fetching}
                                m="auto"
                                my={8}
                                onClick={() => {
                                    setVariables({
                                        limit: variables.limit,
                                        cursor: data.posts.posts[
                                            data.posts.posts.length - 1
                                        ].createdAt
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

// withUrqlClient takes a function and an object - you can't pass in createUrqlClient() since that would pass the return
// value of that function as the first parameter to withUrqlClient
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
