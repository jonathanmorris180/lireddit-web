import { Box, Link, Flex, Button } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data }] = useMeQuery({ pause: isServer() });

    return (
        <Flex bg="tan" p={4}>
            <Box ml={"auto"}>
                {data?.me ? (
                    <Flex>
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
    );
};
