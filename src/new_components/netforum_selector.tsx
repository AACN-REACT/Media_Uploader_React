import React from "react";
import { SetErrorMsg } from "../mediauploader/components/globalstateContext";
import { ErrorHandler, Endpoint } from "./contexts";
export function NetforumSelector({
  typeEndpoint,
  selectEndpoint,
  token,
  close,
}) {
  const errorHandler = React.useContext(ErrorHandler);
  const endHandler = React.useContext(Endpoint);
  const [nfTypes, setNfTypes] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState("f");
  const [nfOptions, setNfOptions] = React.useState([]);
  const [nfSelction, setNfSelection] = React.useState([]);
  const [validSearch, setValidSearch] = React.useState(false);

  const onchange = function (type, search) {
    console.log("HANDLER ", type, selectedType, nfTypes);

    if (search.length > 2 && type.length > 0) {
      setValidSearch(true);
      fetch(
        `https://localhost:44340/api/v0/NetforumItems/NetForumItems?netForumType=${type}&searchText=${encodeURI(
          search
        )}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setNfOptions(res.Result.NetforumItemDtos);
          console.log("RETURN ITEMS", nfOptions);
        })
        .catch((err) => {
          console.log("RETURN ITEMS", err);
          errorHandler(err);
        });
    } else {
      setValidSearch(false);
    }
  };
  React.useEffect(
    function () {
      fetch(typeEndpoint + "ContentTypes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (res) {
          if (res.status === 401) {
            throw new Error("Network Error, probably unauthorised");
          }
          return res.json();
        })
        .then((res) => {
          res.Result.NetforumContentTypes.forEach((el, ind, arr) => {
            setNfTypes((t) => [...t, el.NetforumType]);
          }).catch((err) => SetErrorMsg(err));
        });
    },
    [typeEndpoint]
  );

  React.useEffect(
    function () {
      setSelectedType(nfTypes[0] === "CEActivity" ? `CE Activity` : nfTypes[0]);
    },
    [nfTypes]
  );
  console.log("selection", nfTypes, selectedType);
  return (
    <div onClick={(e) => null /*close()*/} className="netforum-selector">
      <div>
        <div>Type</div>
        <select
          value={selectedType}
          onChange={(e) => {
            e.stopPropagation();
            setSelectedType(
              e.target.value === "CEActivity" ? `CE Activity` : e.target.value
            );
          }}
        >
          {nfTypes.map((el) => (
            <option value={el === "CEActivity" ? `CE Activity` : el}>
              {el === "CEActivity" ? `CE Activity` : el}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div>Keyword</div>
        <input
          autofocus="true"
          className={validSearch ? "valid-input" : "invalid-input"}
          type="text"
          onChange={(e) => {
            e.stopPropagation();
            onchange(selectedType, e.target.value);
          }}
        />
        <div>Select</div>
        <select
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {nfOptions.map((el) => (
            <option>{el.NetforumCode}</option>
          ))}
        </select>
        <button>Add</button>
      </div>
    </div>
  );
}
