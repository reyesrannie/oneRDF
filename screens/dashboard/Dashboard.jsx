import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLazyGetFileQuery,
  useSystemsQuery,
} from "../../services/server/api/systemAPI";
import {
  setSystemImage,
  setSystemImageBackground,
} from "../../services/server/slice/modalSlice";
import ListDisplay from "../../components/custom/display/ListDisplay";
import IconDisplay from "../../components/custom/display/IconDisplay";
import { setSelectedSystem } from "../../services/server/slice/renderSlice";
import LoadingRender from "../../components/custom/LoadingRender";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux State
  const systemDisplay = useSelector((state) => state.render.systemDisplay);

  const userData = useSelector((state) => state.auth.userData);
  const selectedSystem = useSelector((state) => state.render.selectedSystem);

  const { data, isLoading } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const filterSystems = () => {
    if (!data || !userData?.user_system) return [];

    const items = userData?.user_system
      ?.map((userSys) =>
        data?.find(
          (sys) => userSys?.system_id?.toString() === sys?.id?.toString(),
        ),
      )
      .filter(Boolean); // Add .filter(Boolean) to remove any undefined matches

    return items;
  };

  useEffect(() => {
    if (!data?.length) return;

    const systems = filterSystems();

    if (systems.length > 0) {
      if (!selectedSystem) {
        dispatch(setSelectedSystem(systems[0]));
      }
    }
  }, [data, userData]);

  if (isLoading) return <LoadingRender />;

  return systemDisplay === "list" ? (
    <ListDisplay data={filterSystems()} />
  ) : (
    <IconDisplay data={filterSystems()} />
  );
};

export default Dashboard;
