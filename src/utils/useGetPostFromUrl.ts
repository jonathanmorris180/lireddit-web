import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
    const intId = useGetIntId();
    console.log("intId: ", intId);

    const queryResult = usePostQuery({ variables: { id: intId } });
    console.log("queryResult: ", queryResult);
    //test

    const result = usePostQuery({
        // if it's -1, we don't have a good ID
        pause: intId === -1,
        variables: {
            id: intId
        }
    });
    console.log("result from useGetPostFromUrl: ", JSON.stringify(result));
    return result;
};
