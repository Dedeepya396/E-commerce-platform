import React, { Fragment, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function loginSuccess() {
  return (
    <div>
      <div className="alert alert-success">Login successful!!</div>
    </div>
  );
}
export default loginSuccess;
