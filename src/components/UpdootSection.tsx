import { ApolloCache, gql } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
    PostSnippetFragment,
    useVoteMutation,
    VoteMutation
} from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
) => {
    const data = cache.readFragment<{
        id: number;
        points: number;
        voteStatus: number | null;
    }>({
        id: "Post:" + postId,
        fragment: gql`
            fragment _ on Post {
                id
                points
                voteStatus
            }
        `
    });

    if (data) {
        if (data.voteStatus === value) {
            return;
        }

        const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
        cache.writeFragment({
            id: "Post:" + postId,
            fragment: gql`
                fragment _ on Post {
                    points
                    voteStatus
                }
            `,
            data: {
                id: postId,
                points: newPoints,
                voteStatus: value
            }
        });
    }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    // not using fetching from useVoteMutation so that we can tell which button is actually loading
    const [loadingState, setLoadingState] = useState<
        "updoot-loading" | "downdoot-loading" | "not-loading"
    >("not-loading");
    const [vote] = useVoteMutation();
    return (
        <Flex direction="column" alignItems="center" mr={4}>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) return;
                    setLoadingState("updoot-loading");
                    await vote({
                        variables: {
                            postId: post.id,
                            value: 1
                        },
                        update: cache => updateAfterVote(1, post.id, cache)
                    });
                    setLoadingState("not-loading");
                }}
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                isLoading={loadingState === "updoot-loading"}
                size="sm"
                icon={<ChevronUpIcon />}
                aria-label="Vote up"
            />
            {post.points}
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) return;
                    setLoadingState("downdoot-loading");
                    await vote({
                        variables: {
                            postId: post.id,
                            value: -1
                        },
                        update: cache => updateAfterVote(-1, post.id, cache)
                    });
                    setLoadingState("not-loading");
                }}
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                isLoading={loadingState === "downdoot-loading"}
                size="sm"
                icon={<ChevronDownIcon />}
                aria-label="Vote down"
            />
        </Flex>
    );
};
