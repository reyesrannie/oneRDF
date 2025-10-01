import { decodeUser } from "./saveUser";

export const hasAccess = (item = []) => {
  const user = decodeUser();
  const withAccess = user?.access_permission?.some((access) =>
    item?.includes(access)
  );

  return withAccess;
};
