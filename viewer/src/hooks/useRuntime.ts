import {useQuery} from "@tanstack/react-query";
import {getRuntime} from "../api/runtime";

export const useRuntime=()=>useQuery({
 queryKey:["runtime"],
 queryFn:getRuntime,
 refetchInterval:3000
});
