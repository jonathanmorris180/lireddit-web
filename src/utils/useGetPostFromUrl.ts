import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
    const intId = useGetIntId();
    return usePostQuery({
        // if it's -1, we don't have a good ID
        pause: intId === -1,
        variables: {
            id: intId
        }
    });
};
