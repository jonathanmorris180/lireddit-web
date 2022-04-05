import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data }] = useMeQuery({ pause: isServer() });

    console.log("NavBar useMeQuery result: ", JSON.stringify(data));
    console.log("isServer: ", isServer());

    return (
        <Flex bg="tan" p={4} zIndex={1} position="sticky" top={0}>
            <Flex maxW={800} m="auto" align="center" flex={1}>
                <NextLink href="/">
                    <Link>
                        <Heading>LiReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>
                    {data?.me ? (
                        <Flex align="center">
                            <NextLink href="/create-post">
                                <Button as={Link} mr={4}>
                                    Create Post
                                </Button>
                            </NextLink>
                            <Box mr={2}>{data.me.username}</Box>
                            <Button
                                onClick={() => {
                                    logout();
                                }}
                                variant="link"
                                isLoading={logoutFetching}
                            >
                                Logout
                            </Button>
                        </Flex>
                    ) : (
                        <>
                            <NextLink href="/login">
                                <Link mr={2}>Login</Link>
                            </NextLink>
                            <NextLink href="/register">
                                <Link>Register</Link>
                            </NextLink>
                        </>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};
