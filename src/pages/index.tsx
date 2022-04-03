import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Link,
    Stack,
    Text
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as string | null
    });
    const [{ data, fetching }] = usePostsQuery({ variables });

    if (!fetching && !data) {
        return <div>Query failed.</div>;
    }

    return (
        <Layout variant="regular">
            <Flex align="center">
                <Heading>LiReddit</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            <br />
            {fetching && !data ? (
                <div>loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map(p => (
                        <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                            <UpdootSection post={p} />
                            <Box>
                                <Heading fontSize="xl">{p.title}</Heading>
                                <Text>Posted by: {p.creator.username}</Text>
                                <Text mt={4}>{p.textSnippet}</Text>
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            )}
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
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
