import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedPosts } from "../generated/graphql";

const createClient = (ctx?: NextPageContext) =>
    new ApolloClient({
        uri: process.env.NEXT_PUBLIC_API_URL as string,
        connectToDevTools: true,
        credentials: "include",
        headers: {
            cookie:
                (typeof window === "undefined"
                    ? ctx?.req?.headers.cookie
                    : undefined) || ""
        },
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            // false since we don't want to cache separate results—they should all be merged into one: https://www.apollographql.com/docs/react/pagination/core-api/
                            // if we wanted each result to be stored in separate places in the cache, we could pass in something that changes with each query (like cursor)
                            keyArgs: false,
                            merge(
                                existing: PaginatedPosts | undefined,
                                incoming: PaginatedPosts
                            ): PaginatedPosts {
                                return {
                                    ...incoming,
                                    posts: [
                                        ...(existing?.posts || []),
                                        ...incoming.posts
                                    ]
                                };
                            }
                        }
                    }
                }
            }
        })
    });

export const withApollo = createWithApollo(createClient);
