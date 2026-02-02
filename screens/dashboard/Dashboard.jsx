import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  useLazyGetFileQuery,
  useSystemsQuery,
} from "../../services/server/api/systemAPI";
import { setSystemImage } from "../../services/server/slice/modalSlice";
import ListDisplay from "../../components/custom/display/ListDisplay";

const Dashboard = () => {
  const systemImage = useSelector((state) => state.modal.systemImage);
  const userData = useSelector((state) => state.auth.userData);
  const { data, isLoading } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const [getFile] = useLazyGetFileQuery();
  const dispatch = useDispatch();

  const filterSystems = () => {
    const items = userData?.user_system?.map((userSys) =>
      data?.find(
        (sys) => userSys?.system_id?.toString() === sys?.id?.toString(),
      ),
    );

    return items;
  };
  const fetchImage = async (fileName, key) => {
    const file = fileName.split("/").pop();

    const exists = systemImage?.some((img) => img.id === key);
    if (exists) return;
    try {
      const response = await getFile({ fileName: file }).unwrap();
      dispatch(setSystemImage({ id: key, url: response?.imageURL }));
    } catch (error) {
      console.error("Error fetching file:", file, error);
    }
  };

  useEffect(() => {
    if (!data?.length) return;

    const fetchSequentially = async () => {
      const existingIds = new Set(systemImage?.map((img) => img?.id));
      const systems = filterSystems();

      for (const item of systems) {
        if (item?.system_image && item?.id && !existingIds.has(item?.id)) {
          await fetchImage(item?.system_image, item?.id);
        }
      }
    };

    fetchSequentially();
  }, [data]);

  return <ListDisplay data={filterSystems()} />;
};

export default Dashboard;
