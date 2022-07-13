import { useEffect, useState } from "react";
import { getSimilarUsers } from "../util/firebase";
import produce from "immer";

const useInitChatV2 = (dependencies) => {
  const { currentUser } = dependencies;
  const [similarUsers, setSimilarUsers] = useState([]);
  const [error, setError] = useState(null);
  const [channelListQuery, setChannelListQuery] = useState({
    channelListQuery: {
      //customTypesFilter :[""],
      //hiddenChannelFilter: archiveFilter
    },
    applicationUserListQuery: {
      userIdsFilter: []
    }
  })

  const fetchSimilarUser = async () => {
    const [data, err] = await getSimilarUsers(currentUser);
    if(data){
      setSimilarUsers(data);
      setChannelListQuery(produce(draft => {
        draft.applicationUserListQuery.userIdsFilter = data.map(user => user.email)
      }))
    } else {
      setError(err);
    }
  }

  useEffect(() => {
    if(currentUser){
      fetchSimilarUser();
    }
  }, [currentUser]);


  return {
    similarUsers,
    error,
    channelListQuery,
    setChannelListQuery
  }
}

export default useInitChatV2