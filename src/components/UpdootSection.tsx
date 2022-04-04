import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    // not using fetching from useVoteMutation so that we can tell which button is actually loading
    const [loadingState, setLoadingState] = useState<
        "updoot-loading" | "downdoot-loading" | "not-loading"
    >("not-loading");
    const [, vote] = useVoteMutation();
    return (
        <Flex direction="column" alignItems="center" mr={4}>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) return;
                    setLoadingState("updoot-loading");
                    await vote({
                        postId: post.id,
                        value: 1
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
                        postId: post.id,
                        value: -1
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
