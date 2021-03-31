import React, { useState } from "react";

import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import FileUploader from "./FileUploader";
import "./AppendNext.css";

const AppendNext = ({ from }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="append-next">
      <div className="">
        <Plus onClick={() => setOpen(true)} />
        {open && <FileUploader from={from} />}
      </div>
    </div>
  );
};

export default AppendNext;
