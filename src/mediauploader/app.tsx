import * as React from "react";

//components
import { Container } from "./components/container";
import { Portal } from "./components/portal";
import { ErrorToast } from "./components/errortoast";
import { Title } from "./components/title";
import { Body } from "./components/body";
import { Dropzone } from "./components/dropzone";
import { MediaListContainer } from "./components/medialist-container";

//utils
import { EndpointConstructor } from "./utils/endpoint_constructor";

// openid settings and hooks
import { pkce, pkcetls, auth0, aacn } from "./data/identity-config";
import { useAuth } from "./custom_hooks/useAuth";
import { Identity } from "../new_components/contexts";

const mediaManagement = new EndpointConstructor({
  origin: "https://localhost:44340",
  version: 1,
  name: "MediaManagement",
});

export function App() {
  //this function takes no props but includes constants within scope
  // extract  with searh params to give error and or mediaKey intial state
  let searchParams = React.useMemo(() => {
    return new URL(window.location.href).searchParams;
  }, [window.location.href]);

  // this code puts any mediakey in the url into localstorage and returns it or null
  const mediaKeyInUrl: string | boolean = React.useMemo(
    function () {
      if (searchParams.get("mediakey")?.length > 0) {
        let tempMediaKey = searchParams.get("mediakey");
        localStorage.setItem("mediakey", tempMediaKey);
        return tempMediaKey;
      }
      return null;
    },
    [searchParams]
  );

  // set up  global state

  const [tooltip, setToolTip] = React.useState("");

  const [errorMsg, setErrorMsg] = React.useState(
    searchParams.has("error") ? searchParams.get("error") : null
  );

  const [mediaKey, setMediaKey] = React.useState(
    localStorage.getItem("mediakey") || mediaKeyInUrl
  );

  // data state

  const [[pendingList, finalizedList], setManagementLists] = React.useState([
    "idle",
    "idle",
  ]);

  console.log("Pending", pendingList);
  // Effects..
  // initiate authentication
  const [userInfo, isAuthenticated, logout] = useAuth(pkcetls);
  // supply a method to trigger refetching of data

  const [fetchList, fetchListToggle] = React.useState(true);

  // refresh function

  function refreshList() {
    setManagementLists(["loading", "loading"]);
    fetchListToggle((t) => !t);
  }

  let isMounted = true;

  // initiate fetching and setting list
  React.useEffect(
    function () {
      if (isAuthenticated && isMounted) {
        mediaManagement
          .fetchMainList(userInfo.access_token)
          .then((res) => {
            if (res.status === 401) {
              throw new Error("401 api denied request, possible stale token");
            }
            return res.json();
          })
          .then((res) => {
            let completed = res["Result"]["FinalizedMediaDetailsDtos"];
            let pending = res["Result"]["PendingMediaDetailsDtos"];
            isMounted && setManagementLists([pending, completed]);
          })
          .catch((err) => {
            alert("error");
            isMounted && setErrorMsg(err.message);
          });
      }
      return () => {
        isMounted = false;
      };
    },
    [userInfo, isAuthenticated, fetchList]
  );

  return (
    <Container>
      <ErrorToast msg={errorMsg} close={setErrorMsg} />
      <Title
        profile={userInfo.profile}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <Body>
        <MediaListContainer
          list={pendingList}
          mediaKey={mediaKey}
          setMediaKey={setMediaKey}
          fetchListToggle={refreshList}
        />
        <Dropzone />
        <MediaListContainer
          list={finalizedList}
          mediaKey={mediaKey}
          setMediaKey={setMediaKey}
          fetchListToggle={fetchListToggle}
        />
      </Body>
    </Container>
  );
}
