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

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux State
  const systemDisplay = useSelector((state) => state.render.systemDisplay);
  const systemImage = useSelector((state) => state.modal.systemImage);
  const systemImageBackground = useSelector(
    (state) => state.modal.systemImageBackground,
  );
  const userData = useSelector((state) => state.auth.userData);
  const selectedSystem = useSelector((state) => state.render.selectedSystem);

  // API Calls
  const { data, isLoading } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });
  const [getFile] = useLazyGetFileQuery();

  // Helper: Filter systems based on user access
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

  const fetchImage = async (fileName, key) => {
    if (!fileName) return;
    const file = fileName.split("/").pop();

    const exists = systemImage?.some((img) => img.id === key);
    if (exists) return;

    try {
      const response = await getFile({ fileName: file }).unwrap();
      dispatch(setSystemImage({ id: key, url: response?.imageURL }));
    } catch (error) {
      console.error("Error fetching icon:", file, error);
    }
  };

  const fetchImageBackground = async (fileName, key) => {
    if (!fileName) return;
    const file = fileName.split("/").pop();

    const exists = systemImageBackground?.some((img) => img.id === key);
    if (exists) return;

    try {
      const response = await getFile({ fileName: file }).unwrap();
      dispatch(setSystemImageBackground({ id: key, url: response?.imageURL }));
    } catch (error) {
      console.error("Error fetching background:", file, error);
    }
  };

  // MAIN EFFECT: Handle Data, Selection, and Image Fetching
  useEffect(() => {
    if (!data?.length) return;

    const systems = filterSystems();

    // 1. SET DEFAULT SYSTEM (This fixes the background in AppBar)
    // If no system is selected, or the currently selected one isn't in the user's list, pick the first one.
    if (systems.length > 0) {
      if (!selectedSystem) {
        dispatch(setSelectedSystem(systems[0]));
      }
    }

    // 2. FETCH IMAGES
    const fetchSequentially = async () => {
      // Use Sets for faster lookup
      const existingIconIds = new Set(systemImage?.map((img) => img?.id));
      const existingBgIds = new Set(
        systemImageBackground?.map((img) => img?.id),
      );

      for (const item of systems) {
        // Fetch Icon
        if (item?.system_image && item?.id && !existingIconIds.has(item?.id)) {
          await fetchImage(item?.system_image, item?.id);
        }
        // Fetch Background
        if (
          item?.system_background &&
          item?.id &&
          !existingBgIds.has(item?.id)
        ) {
          await fetchImageBackground(item?.system_background, item?.id);
        }
      }
    };

    fetchSequentially();
  }, [data, userData]); // Added userData to dependencies to ensure filters run correctly

  if (isLoading) return <div>Loading...</div>; // Optional loading state

  return systemDisplay === "list" ? (
    <ListDisplay data={filterSystems()} />
  ) : (
    <IconDisplay data={filterSystems()} />
  );
};

export default Dashboard;
