import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
    const intId = useGetIntId();

    const result = usePostQuery({
        // if it's -1, we don't have a good ID
        skip: intId === -1,
        variables: {
            id: intId
        }
    });
    return result;
};
