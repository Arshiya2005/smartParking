import React, { useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const OwnerHome = () => {
    useAuthRedirect("owner");
  return (
    <div>
      HI ! FROM OWNER HOME
    </div>
  )
}

export default OwnerHome
